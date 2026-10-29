// Stumble Gayt: sirve el juego y reenvía en directo la posición de cada jugador.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const MAX_PLAYERS = 30;
const page = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];
  if (url === '/health') { res.writeHead(200); res.end('ok'); return; }
  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(page);
    return;
  }
  res.writeHead(404); res.end('No encontrado');
});

const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 8192 });
const peers = new Map();
let seq = 0;

function sendTo(ws, obj) { if (ws.readyState === 1) ws.send(typeof obj === 'string' ? obj : JSON.stringify(obj)); }
function broadcast(fromId, obj) {
  const msg = JSON.stringify(obj);
  for (const [id, p] of peers) if (id !== fromId) sendTo(p.ws, msg);
}

wss.on('connection', (ws) => {
  if (peers.size >= MAX_PLAYERS) { ws.close(1013, 'Servidor lleno'); return; }
  const id = 'p' + (++seq).toString(36) + Math.random().toString(36).slice(2, 7);
  const me = { ws, presence: {}, alive: true, budget: 40, ts: Date.now() };
  peers.set(id, me);
  sendTo(ws, { t: 'hello', id, peers: [...peers].filter(([k]) => k !== id).map(([k, p]) => ({ peer: k, d: p.presence })) });

  ws.on('pong', () => { me.alive = true; });
  ws.on('message', (buf) => {
    // simple rate limit: ~40 messages per second per player
    const now = Date.now();
    me.budget = Math.min(40, me.budget + (now - me.ts) * 0.04); me.ts = now;
    if (me.budget < 1) return; me.budget -= 1;
    if (buf.length > 4096) return;
    let m; try { m = JSON.parse(buf); } catch (e) { return; }
    if (m && m.t === 'p' && m.d && typeof m.d === 'object' && !Array.isArray(m.d)) {
      me.presence = m.d;
      broadcast(id, { t: 'u', p: id, d: m.d });
    }
  });
  ws.on('close', () => { peers.delete(id); broadcast(id, { t: 'l', p: id }); });
  ws.on('error', () => {});
});

// drop connections that stopped answering
setInterval(() => {
  for (const [id, p] of peers) {
    if (!p.alive) { p.ws.terminate(); continue; }
    p.alive = false; try { p.ws.ping(); } catch (e) {}
  }
}, 30000);

server.listen(PORT, () => console.log('Stumble Gayt en el puerto ' + PORT));
