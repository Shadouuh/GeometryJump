# ⚡ Guía Rápida - Geometric Jump

## 🎮 ¡Empieza a Jugar en 3 Pasos!

### 1️⃣ El servidor ya está corriendo
```
✅ http://localhost:5174
```

### 2️⃣ Inicia sesión
Usa estas credenciales:
```
Usuario: demo
Contraseña: demo123
```

### 3️⃣ ¡Explora!
- Selecciona tu personaje favorito
- Ve al **Editor de Niveles**
- ¡Crea y juega!

---

## 🛠️ Editor de Niveles - Tutorial Rápido

### 🎨 Herramientas Disponibles

| Herramienta | Icono | Descripción |
|------------|-------|-------------|
| **Bloque** | 🟦 | Plataforma sólida |
| **Pincho** | 🔺 | Obstáculo mortal |
| **Inicio** | 📍 | Punto de spawn del jugador |
| **Puerta** | 🚪 | Objetivo del nivel |
| **Borrar** | ✖️ | Elimina objetos |

### 🎮 Controles del Editor

#### Modo Edición
```
🖱️ Click Izquierdo    → Colocar objeto
🖱️ Click Derecho      → Borrar objeto
🖱️ Arrastrar         → Pintar múltiples celdas
```

#### Modo Prueba
```
⬅️ Flecha Izquierda   → Mover izquierda
➡️ Flecha Derecha     → Mover derecha
SPACE                → Saltar
R                    → Reiniciar nivel
ESC                  → Volver al editor
```

### 📦 Cargar Niveles de Ejemplo

1. Click en **"Cargar"**
2. Busca la carpeta `example-levels/`
3. Selecciona `nivel-tutorial.json`
4. ¡Listo para jugar!

### 💾 Guardar Tu Nivel

1. Click en **"Guardar"**
2. Escribe un nombre genial
3. Pon tu nombre como autor
4. Click en **"Exportar JSON"**
5. El archivo se descarga automáticamente

### ✅ Requisitos del Nivel

Para que un nivel sea válido necesitas:
- ✔️ Un punto de **Inicio** (azul)
- ✔️ Una **Puerta** de salida (verde)
- ⚠️ Si faltan, el juego te avisará

---

## 🎯 Tips para Crear Buenos Niveles

### Para Principiantes
1. **Empieza simple**: Pocas plataformas, sin pinchos
2. **Prueba tu nivel**: Asegúrate de que sea completable
3. **Guía al jugador**: Haz obvio el camino

### Para Avanzados
1. **Timing**: Coloca pinchos que requieran saltos precisos
2. **Ritmo**: Alterna momentos de acción y calma
3. **Recompensa**: Haz que llegar al final se sienta épico

### Errores Comunes
- ❌ Niveles imposibles de completar
- ❌ Demasiados pinchos (frustrante)
- ❌ Muy fácil (aburrido)
- ✅ Balance perfecto = Diversión

---

## 🎨 Personajes y Sus Stats

### Boxy 🟦 (Cuadrado)
```
Velocidad: ⭐⭐⭐⭐⭐ (5/10)
Salto:     ⭐⭐⭐⭐⭐ (5/10)
Especial:  ⭐⭐⭐⭐⭐ (5/10)
```
**Estilo**: El equilibrado, perfecto para empezar

### Lastri 🔺 (Triángulo)
```
Velocidad: ⭐⭐⭐⭐⭐⭐⭐ (7/10)
Salto:     ⭐⭐⭐⭐⭐⭐ (6/10)
Especial:  ⭐⭐⭐⭐ (4/10)
```
**Estilo**: Ágil y rápido, para speedruns

### Gordo 🔵 (Círculo)
```
Velocidad: ⭐⭐⭐ (3/10)
Salto:     ⭐⭐⭐⭐ (4/10)
Especial:  ⭐⭐⭐⭐⭐⭐⭐⭐ (8/10)
```
**Estilo**: Tanque, resistente y poderoso

### Isquio 🔺 (Isósceles)
```
Velocidad: ⭐⭐⭐⭐⭐⭐ (6/10)
Salto:     ⭐⭐⭐⭐⭐⭐⭐ (7/10)
Especial:  ⭐⭐⭐⭐⭐ (5/10)
```
**Estilo**: Saltador experto, domina el aire

### Rectangu 🔲 (Rectángulo)
```
Velocidad: ⭐⭐⭐⭐⭐⭐⭐⭐ (8/10)
Salto:     ⭐⭐⭐⭐⭐ (5/10)
Especial:  ⭐⭐⭐⭐ (4/10)
```
**Estilo**: El más rápido, perfecto para carreras

---

## 🐛 Solución de Problemas

### El nivel no se puede probar
- ✅ Verifica que tengas **Inicio** y **Puerta**
- ✅ Asegúrate de que el camino sea posible

### El personaje atraviesa bloques
- 🔄 Reinicia el nivel con **R**
- 🔄 Si persiste, vuelve al editor y recoloca el bloque

### El JSON no se carga
- ✅ Verifica que el formato sea correcto
- ✅ Usa los niveles de ejemplo como referencia
- ✅ Asegúrate de que todas las comillas sean válidas

### Performance lento
- 🚀 Evita poner demasiados objetos (max ~100)
- 🚀 El motor está optimizado con spatial grid
- 🚀 Cierra otras pestañas del navegador

---

## 🎓 Recursos Adicionales

- 📖 **README.md**: Documentación completa
- 🏗️ **GAME-ARCHITECTURE.md**: Arquitectura técnica
- 📦 **example-levels/**: Niveles de ejemplo listos

---

## 🎉 ¡A Jugar!

El juego está **100% funcional**:
- ✅ Editor completamente operativo
- ✅ Motor de físicas optimizado
- ✅ Sistema de guardado/carga JSON
- ✅ 5 personajes únicos
- ✅ Diseño hermoso y profesional

**¡Crea niveles épicos y diviértete! 🚀✨**

---

**Última actualización**: Diciembre 2024
