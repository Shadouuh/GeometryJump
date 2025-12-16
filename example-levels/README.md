# 📦 Niveles de Ejemplo

Esta carpeta contiene niveles de ejemplo que puedes cargar en el editor.

## 🎮 Cómo Usar

1. Abre el **Editor de Niveles** en el juego
2. Haz clic en el botón **"Cargar"**
3. Puedes:
   - **Subir el archivo JSON** directamente
   - **Copiar y pegar** el contenido del archivo en el campo de texto

## 📝 Niveles Disponibles

### nivel-test-simple.json ⭐ NUEVO
- **Dificultad**: ⭐ Muy Fácil
- **Descripción**: Nivel de prueba para verificar que los controles funcionen correctamente
- **Elementos**: Plataformas básicas, sin peligros
- **Uso**: Perfecto para probar el movimiento y salto

### nivel-tutorial.json
- **Dificultad**: ⭐ Fácil
- **Descripción**: Un nivel sencillo para aprender los controles básicos
- **Elementos**: Plataformas simples sin peligros

### nivel-pinchos.json
- **Dificultad**: ⭐⭐ Media
- **Descripción**: Introduce los pinchos y requiere saltos precisos
- **Elementos**: Plataformas + Pinchos mortales

## 🛠️ Crear Tus Propios Niveles

1. Usa el **Editor de Niveles** para diseñar tu nivel
2. Haz clic en **"Guardar"** para exportar el JSON
3. Guarda el archivo con un nombre descriptivo
4. ¡Comparte tu nivel con otros jugadores!

## 📋 Estructura del JSON

```json
{
  "name": "Nombre del Nivel",
  "author": "Tu Nombre",
  "gridSize": 40,
  "spawn": {
    "x": 80,
    "y": 400,
    "type": "spawn"
  },
  "door": {
    "x": 680,
    "y": 400,
    "type": "door"
  },
  "objects": [
    { "x": 0, "y": 480, "type": "block" },
    { "x": 40, "y": 440, "type": "spike" }
  ]
}
```

## 🎯 Tipos de Objetos

- **block**: Bloque sólido (se puede caminar sobre él)
- **spike**: Pincho mortal (mata al jugador)
- **spawn**: Punto de inicio del jugador
- **door**: Puerta de salida (objetivo del nivel)

## 💡 Consejos de Diseño

- ✅ Asegúrate de tener un **spawn** y una **door**
- ✅ Prueba tu nivel antes de compartirlo
- ✅ No hagas niveles imposibles de completar
- ✅ Balancea dificultad con diversión
- ✅ Usa pinchos estratégicamente, no en exceso

¡Diviértete creando! 🎨✨
