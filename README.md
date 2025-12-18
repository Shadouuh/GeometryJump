# Geometric Jump
 
 Este repo tiene:
 
 - **Frontend**: React + Vite + P5.js (el juego y el editor corren dentro de canvases P5 en “instance mode”).
 - **Backend**: PHP + MySQL (API simple para auth y niveles de la comunidad).
 
 El objetivo de este README es que puedas **entender el flujo del código**, saber **qué APIs de P5.js se usan**, y ubicar rápido **dónde está cada responsabilidad**.
 
 ---
 
 ## Correr el proyecto (dev)
 
 ### Frontend
 
 - Requisito: Node 16+
 - Comando:
 
 ```bash
 npm run dev
 ```
 
 Vite levanta el frontend (por defecto `http://localhost:5173`).
 
 ### Backend (PHP + MySQL)
 
 - Requisito: PHP 8+ y MySQL/MariaDB
 - DB: ejecutar `backend/init.sql` (crea DB `geometryjump` y tablas `users` / `levels`).
 - Conexión: `backend/db.php` usa env vars (con defaults):
 
 ```text
 DB_HOST=localhost
 DB_NAME=geometryjump
 DB_USER=root
 DB_PASS=
 ```
 
 - Servidor PHP en el puerto que espera el frontend:
 
 ```bash
 php -S localhost:8000 -t backend
 ```
 
 ---
 
 ## Estructura (qué mirar primero)
 
 - **Entrada del frontend**
   - `src/main.jsx`: monta React.
   - `src/App.jsx`: define rutas con React Router.
 - **Rutas / páginas**
   - `src/pages/Login/Login.jsx`
   - `src/pages/Register/Register.jsx`
   - `src/pages/Menu/Menu.jsx`
   - `src/pages/Editor/Editor.jsx`
   - `src/pages/Community/Community.jsx`
 - **Motor del juego**
   - `src/game/Level.js`: estado del nivel (objetos, spawn, puerta, JSON).
   - `src/game/GameObject.js`: clases que dibujan objetos (bloques, pinchos, agua, etc.).
   - `src/game/GameEngine.js`: loop de juego (input → update → draw).
   - `src/game/InputController.js`: lectura de teclas via P5.
   - `src/game/Background.js`: fondos temáticos.
 - **Canvas P5 integrados en React**
   - `src/pages/Editor/components/EditorCanvas.jsx`: editor + playtest.
   - `src/pages/Menu/components/CharacterPreview.jsx`: preview del personaje.
 - **Servicios / API**
   - `src/services/authService.js`: login/register (fetch + localStorage).
 - **Backend (PHP)**
   - `backend/auth/login.php`, `backend/auth/register.php`
   - `backend/levels/save.php`, `backend/levels/list.php`, `backend/levels/get.php`
   - `backend/db.php`: PDO
   - `backend/init.sql`: esquema
 
 ---
 
 ## Flujo de la aplicación (de punta a punta)
 
 ### 1) Arranque y routing
 
 - `src/main.jsx` renderiza `<App />`.
 - `src/App.jsx` define rutas:
   - Públicas: `/login`, `/register`
   - Protegidas (con `ProtectedRoute`): `/menu`, `/story`, `/editor`, `/community`
 - `src/components/ProtectedRoute/ProtectedRoute.jsx` redirige a `/login` si no estás autenticado.
 
 ### 2) Login / Register
 
 - UI: `Login.jsx` / `Register.jsx`
 - Lógica: `useAuth` (`src/hooks/useAuth.js`) usa `authService`.
 - Persistencia: `authService` guarda el usuario en `localStorage` (`currentUser`).
 - API:
   - `POST {user/pass}` → `http://localhost:8000/auth/login.php`
   - `POST {username/email/password}` → `http://localhost:8000/auth/register.php`
 
 ### 3) Menu (selección de personaje)
 
 - `Menu.jsx` maneja el carousel de personajes.
 - `CharacterPreview.jsx` crea una instancia de P5 para dibujar un preview animado (no es gameplay).
 
 ### 4) Editor de niveles (modo edit)
 
 - `Editor.jsx` crea un `Level` (`new Level()`), guarda estado de herramienta, y abre/cierra modales.
 - `EditorCanvas.jsx` (P5) dibuja:
   - Fondo + grilla
   - `level.draw(p)` para renderizar los objetos
   - overlays (celda hovered, selección, etc.)
 - Edición de grilla:
   - El nivel usa **grid de 40px** (`gridSize = 40`).
   - `Level.addObject()` y `Level.removeObjectAt()` “snap” a la grilla.
 
 ### 5) Playtest (modo play)
 
 - `Editor.jsx` setea `mode = 'play'`.
 - `EditorCanvas.jsx` crea **una sola vez** `new GameEngine(level, characterData, p)`.
 - Loop por frame:
   - `engine.handleInput()`
   - `engine.update()`
   - `engine.draw(p)`
 - `GameEngine` delega lectura de teclas en `InputController`.
 
 ### 6) Guardar / exportar / subir un nivel
 
 - UI: `LevelModal.jsx`
 - Export local: `level.exportJSON()` (string JSON) y descarga con `Blob`.
 - Subir a backend:
   - `POST http://localhost:8000/levels/save.php`
   - body: `{ name, author, json, user_id }`
 - El backend inserta en la tabla `levels (user_id, name, author, json, created_at)`.
 
 ### 7) Comunidad (listar / jugar niveles de DB)
 
 - `Community.jsx`:
   - Lista: `GET http://localhost:8000/levels/list.php`
   - Obtener: `GET http://localhost:8000/levels/get.php?id=...`
 - Para jugar:
   - `Level.importJSON(jsonString)`
   - Reusa `EditorCanvas` en `mode='play'` (eso crea `GameEngine` y corre el juego).
 
 ---
 
 ## Qué es importante entender del motor
 
 - **`Level` es el “modelo”**: contiene `objects`, `coins`, `keys`, `enemies`, `spawnPoint`, `door` y métodos para JSON.
 - **`GameObject` y subclases son “vista”**: cada objeto tiene `draw(p5)` y (a veces) `update()`.
 - **`GameEngine` es “controlador del runtime”**:
   - Controla estados: `ready`, `playing`, `won`, `lost`.
   - Maneja colisiones e interacciones (monedas, llaves, lava/agua, etc.).
 
 ---
 
 ## P5.js: funciones y propiedades usadas en este proyecto
 
 Esto es un inventario de lo que aparece en `src/` (sobre todo en `EditorCanvas.jsx`, `GameObject.js`, `Background.js`, `GameEngine.js`, `Player.js`, `InputController.js`, `characterDrawer.js`).
 
 ### Ciclo de vida / instancia
 
 - `new p5(sketch, domNode)` (instance mode)
 - `p.setup = () => { ... }`
 - `p.draw = () => { ... }`
 - `p.mouseMoved`, `p.mouseDragged`, `p.mousePressed`, `p.mouseReleased`
 - `p.keyPressed`
 - `p.remove()` (limpieza al desmontar)
 
 ### Canvas y tiempo
 
 - `createCanvas(width, height)`
 - `frameRate(fps)`
 - `frameCount`
 
 ### Estado de dibujo
 
 - `push()` / `pop()`
 - `translate(x, y)`
 - `rotate(angle)`
 - `radians(deg)`
 - `scale(s)` / `scale(x, y)`
 - `tint(r, g, b, a)`
 
 ### Color y estilos
 
 - `background(r, g, b)`
 - `fill(r, g, b, [a])`
 - `stroke(r, g, b, [a])`
 - `noFill()`
 - `noStroke()`
 - `strokeWeight(w)`
 - `color(r, g, b, [a])`
 - `lerpColor(c1, c2, amt)`
 
 ### Primitivas 2D
 
 - `rect(x, y, w, h, [radius])`
 - `rectMode(CORNER|CENTER)`
 - `circle(x, y, d)`
 - `ellipse(x, y, w, h)`
 - `line(x1, y1, x2, y2)`
 - `triangle(x1, y1, x2, y2, x3, y3)`
 - `quad(x1, y1, x2, y2, x3, y3, x4, y4)`
 - `arc(x, y, w, h, start, stop)`
 
 ### Texto
 
 - `text(str, x, y)`
 - `textSize(px)`
 - `textAlign(LEFT|CENTER|RIGHT, [BASELINE|CENTER])`
 
 ### Input / mouse
 
 - `keyIsDown(keyCode)`
 - `mouseIsPressed`
 - `mouseX`, `mouseY`
 - Constantes de teclas: `LEFT_ARROW`, `RIGHT_ARROW`, `UP_ARROW`, `ESCAPE`, etc.
 - `key`, `keyCode`
 
 ### Math / random
 
 - `map(value, start1, stop1, start2, stop2)`
 - `random(min, max)`
 - `randomSeed(seed)`
 - Constantes: `PI`, `TWO_PI`
 
 ---
 
 ## Backend: endpoints y esquema
 
 ### Endpoints
 
 - `POST /auth/login.php`
 - `POST /auth/register.php`
 - `GET /levels/list.php`
 - `GET /levels/get.php?id=...`
 - `POST /levels/save.php`
 
 ### Esquema (MySQL)
 
 - `users(id, username, email, password, created_at)`
 - `levels(id, user_id, name, author, json, created_at, indexes...)`
