# 🎮 Geometric Jump

Un juego de plataformas con personajes geométricos desarrollado con React, Vite y P5.js. Diseño minimalista dark gaming con acentos morados y azules.

## ✨ Características

- 🎨 **Personajes Geométricos Únicos**: Boxy, Lastri, Gordo, Isquio y Rectangu, cada uno con habilidades diferentes
- 🔐 **Sistema de Autenticación**: Login y registro (datos hardcodeados para desarrollo)
- 🎯 **Modo Historia**: Niveles progresivos con diferentes dificultades
- 🛠️ **Editor de Niveles Completo**: ¡NUEVO! Crea, prueba y exporta tus propios niveles
  - Grid interactivo con drag & drop
  - Colocación de bloques, pinchos, spawn y puerta
  - Modo de prueba en tiempo real
  - Sistema de guardado/carga JSON
  - Motor de físicas optimizado
- 👥 **Comunidad**: Comparte y juega niveles de otros jugadores (próximamente)
- 🎨 **Diseño Dark Gaming**: Interfaz moderna y minimalista con gradientes vibrantes

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

1. Las dependencias ya están instaladas. Si necesitas reinstalarlas:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:5173`

## 🎮 Cómo Jugar

### Credenciales de Prueba

Puedes usar cualquiera de estas cuentas para probar:

- **Usuario**: `demo` | **Contraseña**: `demo123`
- **Usuario**: `player1` | **Contraseña**: `123456`
- **Usuario**: `gamer` | **Contraseña**: `password`

### Personajes Disponibles

1. **Boxy** 🟦 - Equilibrado en todas las categorías
2. **Lastri** 🔺 - Ágil y rápido
3. **Gordo** 🔵 - Robusto y resistente
4. **Isquio** 🔺 - Preciso en el salto
5. **Rectangu** 🔲 - Súper veloz

### Editor de Niveles

El editor está **completamente funcional**:

1. **Modo Edición**:
   - Click izquierdo para colocar objetos
   - Click derecho para borrar
   - Arrastra para pintar múltiples celdas
   - Grid de 40x40 píxeles

2. **Modo Prueba**:
   - Prueba tu nivel en tiempo real
   - Controles: ←→ mover, SPACE saltar
   - ESC para volver al editor
   - R para reiniciar

3. **Guardado/Carga**:
   - Exporta niveles en formato JSON
   - Importa niveles desde archivos o JSON
   - Niveles de ejemplo incluidos en `/example-levels/`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Header/
│   └── ProtectedRoute/
├── pages/              # Páginas de la aplicación
│   ├── Login/
│   ├── Register/
│   ├── Menu/
│   ├── Story/
│   ├── Editor/         # ✨ Editor completo con canvas y toolbar
│   │   └── components/
│   │       ├── EditorCanvas.jsx
│   │       ├── EditorToolbar.jsx
│   │       └── LevelModal.jsx
│   └── Community/
├── game/               # 🎮 Motor de juego
│   ├── Player.js       # Clase del jugador con físicas
│   ├── GameObject.js   # Clases de objetos (Block, Spike, Door)
│   ├── Level.js        # Sistema de niveles
│   ├── GameEngine.js   # Motor principal del juego
│   └── PhysicsEngine.js # Motor de físicas optimizado
├── services/           # Lógica de negocio
│   ├── authService.js
│   └── characterService.js
├── hooks/              # Custom hooks
│   ├── useAuth.js
│   └── useCharacter.js
├── utils/              # Utilidades
│   └── characterDrawer.js
├── App.jsx             # Componente principal con routing
└── main.jsx           # Punto de entrada

example-levels/         # 📦 Niveles de ejemplo
├── nivel-tutorial.json
├── nivel-pinchos.json
└── README.md
```

## 🛠️ Tecnologías

- **React 19** - Framework de UI
- **Vite** - Build tool y dev server
- **P5.js** - Librería para gráficos y animaciones
- **React Router** - Navegación
- **React Icons** - Iconos
- **CSS3** - Estilos con variables CSS y animaciones

## 🎨 Paleta de Colores

- **Primario**: `#8b5cf6` (Violeta)
- **Secundario**: `#6366f1` (Índigo)
- **Acento**: `#3b82f6` (Azul)
- **Púrpura**: `#a855f7`
- **Cyan**: `#06b6d4`

## 📝 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

## ✅ Completado

- [x] **Sistema de personajes con clases** - Cada personaje tiene stats únicos
- [x] **Motor de físicas optimizado** - Colisiones AABB con grid espacial
- [x] **Editor de niveles visual** - Drag & drop, grid interactivo
- [x] **Modo de juego funcional** - Controles, físicas, win/lose
- [x] **Sistema de guardado JSON** - Exportar/importar niveles
- [x] **Diseño estético gaming** - Dark theme con acentos violetas/azules

## 🚧 Próximas Funcionalidades

- [ ] Niveles del modo historia jugables con progresión
- [ ] Más tipos de obstáculos (plataformas móviles, trampolines)
- [ ] Power-ups y mecánicas especiales
- [ ] Sistema de guardado de progreso local
- [ ] Integración con backend para niveles de comunidad
- [ ] Sistema de puntuación y tabla de récords
- [ ] Música y efectos de sonido
- [ ] Multijugador local

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

Desarrollado con ❤️ para la comunidad gaming

---

**¡Disfruta saltando! 🎮✨**
