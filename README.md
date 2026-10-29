# Stumble Gayt

Carrera de kitesurf multijugador en la playa de Vargas, con 10 riders, vidas y pedradas.
Funciona en el navegador del ordenador y del móvil.

## Cómo subirlo a Render (gratis)

### 1. Sube el código a GitHub
1. Crea una cuenta en https://github.com si no tienes.
2. Crea un repositorio nuevo, por ejemplo `stumble-gayt`. Puede ser privado.
3. Sube estos archivos y carpetas, sin la carpeta `node_modules`:
   - `package.json`
   - `package-lock.json`
   - `server.js`
   - `public/index.html`
   - `README.md`

   Puedes arrastrarlos con la opción de subir archivos de la web de GitHub. Mantén `index.html` dentro de la carpeta `public`.

### 2. Crea el servicio en Render
1. Crea una cuenta en https://render.com y conecta tu GitHub.
2. Crea un nuevo **Web Service** y elige el repositorio `stumble-gayt`.
3. Configúralo así:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free
4. Dale a desplegar. Tarda un par de minutos.
5. Render te da un enlace del tipo `https://stumble-gayt-xxxx.onrender.com`.

### 3. A jugar
- Manda el enlace al grupo. No hace falta cuenta de nada.
- Todos elegís rider, pulsáis **¡Al agua!** y esperáis en la sala.
- Uno pulsa **Empezar carrera** y entráis todos en la misma carrera. Los huecos hasta 10 se llenan con bots.

## Qué saber del plan gratis
- **Se duerme:** si nadie juega durante 15 minutos, el servidor se apaga. El primero que entre después espera alrededor de un minuto mientras arranca. Luego va normal.
- **Datos:** el plan gratis incluye unos 5 GB de tráfico al mes. Con 10 jugadores a la vez eso da para unas 5 o 6 horas de partidas al mes. Con menos jugadores, para bastante más.
- **Sin cuentas ni puntuaciones guardadas:** el servidor solo reenvía posiciones en directo. Si se reinicia, no se pierde nada importante.

## Cambiar riders y stats
Edita `public/index.html` y busca `const ROSTER=[`. Cada rider tiene este formato:

```
{key:'ivo',name:'Igor',stats:[10,6,7,8,7]}
```

Las stats van en orden: Inteligencia, Popularidad, Fuerza, Fuckboy, Gracia.
Sube el archivo cambiado a GitHub y Render vuelve a desplegar solo.

## Probarlo en tu ordenador
```
npm install
npm start
```
Abre http://localhost:3000.
