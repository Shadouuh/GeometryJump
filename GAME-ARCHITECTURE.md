# 🎮 Arquitectura del Motor de Juego

## 📐 Arquitectura General

El juego está construido siguiendo principios de Programación Orientada a Objetos (OOP) con clases bien definidas y separación de responsabilidades.

```
┌─────────────────────────────────────────────┐
│         Editor de Niveles (React)           │
│  ┌───────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Canvas   │  │ Toolbar  │  │  Modal   │ │
│  └─────┬─────┘  └─────┬────┘  └─────┬────┘ │
└────────┼──────────────┼─────────────┼──────┘
         │              │             │
         ▼              ▼             ▼
┌─────────────────────────────────────────────┐
│          Motor de Juego (Clases)            │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐ │
│  │ GameEngine│  │   Level   │  │  Player  │ │
│  └─────┬────┘  └─────┬─────┘  └────┬─────┘ │
│        │             │              │       │
│        └─────────────┼──────────────┘       │
│                      ▼                       │
│            ┌──────────────────┐             │
│            │ PhysicsEngine    │             │
│            └──────────────────┘             │
└─────────────────────────────────────────────┘
```

## 🎯 Clases Principales

### 1. Player (src/game/Player.js)

**Responsabilidad**: Manejar el estado y comportamiento del jugador.

**Propiedades**:
- `x, y`: Posición en el canvas
- `width, height`: Dimensiones del jugador
- `velocityX, velocityY`: Velocidad actual
- `characterData`: Datos del personaje seleccionado
- `isGrounded`: ¿Está tocando el suelo?
- `isAlive`: ¿Está vivo?

**Métodos principales**:
```javascript
update()              // Actualiza físicas (gravedad, fricción)
moveLeft()           // Mueve a la izquierda
moveRight()          // Mueve a la derecha
jump()               // Salta si está en el suelo
draw(p5)             // Dibuja el personaje con P5.js
applyCharacterStats()// Aplica stats del personaje
```

**Optimizaciones**:
- Fricción para movimiento más natural
- Límite de velocidad vertical para evitar bugs
- Squash/stretch animation en saltos

### 2. GameObject y Subclases (src/game/GameObject.js)

**Clase Base: GameObject**
- Propiedades comunes: `x, y, type, width, height`
- Métodos: `draw(p5)`, `getBounds()`, `toJSON()`

**Subclases**:

#### Block
- Bloque sólido por el que se puede caminar
- Color: Gris azulado
- Propiedades: Ninguna adicional

#### Spike
- Pincho mortal que mata al jugador
- Color: Rojo con glow animado
- Animación: Pulso de peligro

#### Door
- Puerta de salida del nivel
- Color: Verde brillante
- Animación: Efecto portal/brillo

#### SpawnPoint
- Punto de inicio del jugador
- Color: Azul
- Animación: Pulso circular

### 3. PhysicsEngine (src/game/PhysicsEngine.js)

**Responsabilidad**: Manejar todas las colisiones y físicas del juego.

**Métodos principales**:

```javascript
checkCollision(bounds1, bounds2)
// Colisión AABB básica entre dos rectángulos

resolveBlockCollision(player, block)
// Resuelve colisión con bloque, determina el lado
// y mueve al jugador a la posición correcta

checkSpikeCollision(player, spike)
// Verifica si el jugador toca un pincho
// Hitbox ligeramente reducida para mejor jugabilidad

checkDoorCollision(player, door)
// Verifica si el jugador alcanzó la puerta

getNearbyObjects(player, objects, range)
// OPTIMIZACIÓN: Spatial grid para reducir cálculos
// Solo verifica colisiones con objetos cercanos
```

**Optimización - Spatial Grid**:
```
En lugar de verificar colisiones con TODOS los objetos:
- Divide el mundo en celdas de 40x40
- Solo verifica objetos en celdas adyacentes
- Complejidad: O(n) → O(1) promedio
```

### 4. Level (src/game/Level.js)

**Responsabilidad**: Gestionar todos los objetos del nivel.

**Propiedades**:
- `objects[]`: Array de todos los objetos del nivel
- `spawnPoint`: Punto de inicio
- `door`: Puerta de salida
- `name, author`: Metadata del nivel
- `gridSize`: Tamaño de la cuadrícula (40px)

**Métodos**:

```javascript
addObject(type, x, y)
// Agrega un objeto alineado al grid

removeObjectAt(x, y)
// Elimina objeto en posición específica

getBlocks() / getSpikes()
// Obtiene objetos filtrados por tipo

validate()
// Verifica que el nivel sea válido
// Debe tener spawn + door

toJSON() / loadFromJSON(data)
// Serialización para guardar/cargar

exportJSON() / importJSON(jsonString)
// Exporta/importa como string JSON
```

### 5. GameEngine (src/game/GameEngine.js)

**Responsabilidad**: Orquestar el loop principal del juego.

**Estados del Juego**:
- `ready`: Esperando a que el jugador presione SPACE
- `playing`: Jugando activamente
- `won`: Nivel completado
- `lost`: Jugador murió

**Loop Principal**:
```javascript
update() {
  1. Actualizar físicas del jugador
  2. Verificar límites del mundo
  3. Colisiones con bloques cercanos
  4. Colisiones con pinchos
  5. Colisión con puerta
  6. Actualizar estado del juego
}

draw(p5) {
  1. Dibujar nivel completo
  2. Dibujar jugador
  3. Dibujar UI (timer, mensajes)
}

handleInput(keys) {
  1. Procesar teclas presionadas
  2. Enviar comandos al jugador
}
```

## ⚡ Optimizaciones Implementadas

### 1. Spatial Grid (PhysicsEngine)
```javascript
// En lugar de O(n) colisiones:
for (object of allObjects) {
  checkCollision(player, object)
}

// Usamos O(1) promedio:
nearbyObjects = getNearbyObjects(player, objects, range=3)
for (object of nearbyObjects) {
  checkCollision(player, object)
}
```

### 2. Reúso de Instancias
- Los objetos del nivel se crean una vez
- Solo se actualizan/dibujan cuando son necesarios
- No se crean/destruyen constantemente

### 3. Límites de Velocidad
```javascript
// Evita velocidades infinitas por acumulación
this.velocityY = Math.max(-20, Math.min(20, this.velocityY));
```

### 4. Frame Rate Controlado
```javascript
p.frameRate(60); // 60 FPS constantes
```

### 5. Hitbox Ajustada para Pinchos
```javascript
// Hitbox ligeramente más pequeña = mejor jugabilidad
const spikeHitbox = {
  left: spikeBounds.left + 5,
  right: spikeBounds.right - 5,
  // ...
}
```

## 🎨 Integración con P5.js

### Renderizado Eficiente
```javascript
// P5.js maneja el canvas directamente
// No usamos React para re-renders del juego
// Mejor performance

draw(p5) {
  p5.push();  // Guarda estado
  // ... dibuja objeto
  p5.pop();   // Restaura estado
}
```

### Animaciones
- Usamos `p5.frameCount` para animaciones
- Sin setTimeout/setInterval
- Sincronizado con el refresh rate

## 🔧 Sistema de Input

### Teclado
```javascript
// Sistema simple de keys presionadas
keysPressed = {}

p.keyPressed = () => {
  keysPressed[p.key] = true
}

p.keyReleased = () => {
  keysPressed[p.key] = false
}

// En game loop:
gameEngine.handleInput(keysPressed)
```

## 💾 Sistema de Guardado

### Formato JSON
```json
{
  "name": "Mi Nivel",
  "author": "Usuario",
  "gridSize": 40,
  "spawn": { "x": 80, "y": 400, "type": "spawn" },
  "door": { "x": 680, "y": 400, "type": "door" },
  "objects": [
    { "x": 0, "y": 480, "type": "block" },
    { "x": 40, "y": 440, "type": "spike" }
  ]
}
```

### Serialización
```javascript
// Cada GameObject implementa toJSON()
toJSON() {
  return { x: this.x, y: this.y, type: this.type }
}

// El Level serializa todo
level.toJSON() → Objeto completo
level.exportJSON() → String JSON formateado
```

### Deserialización
```javascript
// Factory pattern para recrear objetos
createGameObject(data) {
  switch (data.type) {
    case 'block': return new Block(data.x, data.y)
    case 'spike': return new Spike(data.x, data.y)
    // ...
  }
}
```

## 🎯 Flujo del Editor

```
Usuario abre Editor
    ↓
Se crea Level con nivel por defecto
    ↓
Usuario selecciona herramienta
    ↓
Click en canvas → addObject() / removeObject()
    ↓
Usuario hace click en "Probar"
    ↓
Se valida el nivel (spawn + door)
    ↓
Se crea GameEngine con el Level actual
    ↓
Modo Play: Game loop activo
    ↓
ESC → Vuelve a modo Edit
    ↓
Usuario guarda → exportJSON()
```

## 🚀 Mejoras Futuras

### Performance
- [ ] Object pooling para objetos reutilizables
- [ ] Culling: No dibujar objetos fuera de pantalla
- [ ] Web Workers para físicas pesadas

### Features
- [ ] Más tipos de objetos (plataformas móviles)
- [ ] Partículas y efectos visuales
- [ ] Sistema de power-ups
- [ ] Checkpoints en niveles largos

### Networking
- [ ] Backend para guardar niveles
- [ ] Sistema de likes/comentarios
- [ ] Leaderboards por nivel

---

**Autor**: Sistema implementado con arquitectura escalable y limpia
**Última actualización**: Diciembre 2024
