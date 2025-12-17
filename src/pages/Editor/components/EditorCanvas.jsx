import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import './EditorCanvas.css';

import { GameEngine } from '../../../game/GameEngine';

// EditorCanvas (p5)
// setup() = una vez
// draw() = en loop
// edit = grilla + nivel + preview
// play = GameEngine (input -> update -> draw)

export const EditorCanvas = ({ 
  level, 
  selectedTool,
  selectedBlockType,
  selectedKeyType,
  selectedCharacterType,
  selectedFlameInterval,
  mode, 
  onModeChange,
  characterData 
}) => {
  const canvasRef = useRef(null); // div donde p5 mete el canvas
  const containerRef = useRef(null); // contenedor con scroll (camara)
  const p5Instance = useRef(null); // instancia viva de p5
  const gameEngineRef = useRef(null); // instancia viva del juego
  const selectedBlocksRef = useRef([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [changeTypeOpen, setChangeTypeOpen] = useState(false);
  const conversionTypes = [
    { id: 'block', name: 'Bloque' },
    { id: 'spike', name: 'Pincho' },
    { id: 'water', name: 'Agua' },
    { id: 'lava', name: 'Lava' },
    { id: 'falling_block', name: 'Frágil' },
    { id: 'coin', name: 'Moneda' },
    { id: 'key', name: 'Llave' },
    { id: 'locked_door', name: 'Puerta Bloqueada' },
    { id: 'enemy', name: 'Enemigo' },
    { id: 'character_gate', name: 'Pasadizo' },
    { id: 'switch_platform', name: 'Cambio Personaje' },
    { id: 'double_jump', name: 'Doble Salto' },
    { id: 'flamethrower', name: 'Lanzallamas' }
  ];
  const applyChangeType = (type) => {
    const items = selectedBlocksRef.current.slice();
    items.forEach(b => {
      level.removeObjectAt(b.x, b.y);
      if (type === 'block') {
        level.addObject('block', b.x, b.y, selectedBlockType);
      } else if (type === 'key') {
        level.addObject('key', b.x, b.y, selectedKeyType);
      } else if (type === 'locked_door') {
        level.addObject('locked_door', b.x, b.y, selectedKeyType);
      } else if (type === 'character_gate') {
        level.addObject('character_gate', b.x, b.y, selectedCharacterType);
      } else if (type === 'flamethrower') {
        level.addObject('flamethrower', b.x, b.y, selectedFlameInterval);
      } else {
        level.addObject(type, b.x, b.y);
      }
    });
    selectedBlocksRef.current = [];
    setChangeTypeOpen(false);
    setContextMenu({ visible: false, x: 0, y: 0 });
  };
  const handleDeleteSelected = () => {
    const items = selectedBlocksRef.current.slice();
    items.forEach(b => level.removeObjectAt(b.x, b.y));
    selectedBlocksRef.current = [];
    setContextMenu({ visible: false, x: 0, y: 0 });
  };
  const handleDeselect = () => {
    selectedBlocksRef.current = [];
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  // Si volvemos a edit: cortamos el juego y dejamos el nivel "limpio"
  useEffect(() => {
    if (mode === 'edit') {
      gameEngineRef.current = null; // ya no hay juego corriendo

      // Reset visual (porque play cambia estados como collected)
      if (level) {
        level.resetCoins(); // monedas vuelven
        level.resetKeys(); // llaves vuelven y puertas vuelven a bloquear
        level.objects.forEach(obj => {
          if (obj.type === 'falling_block' && obj.reset) {
            obj.reset(); // plataforma que cae vuelve
          }
        });
      }
    }
  }, [mode]);

  useEffect(() => {
    if (!level) return; // sin nivel no dibujamos nada
    
    const sketch = (p) => {
      const GRID_SIZE = 40; // tamano de celda
      const levelDims = level.getSizeDimensions ? level.getSizeDimensions() : { width: 800, height: 600 }; // tamano del mundo
      const WIDTH = levelDims.width; // ancho del canvas
      const HEIGHT = levelDims.height; // alto del canvas
      
      let hoveredCell = { x: -1, y: -1 }; // celda bajo el mouse
      let isDragging = false; // estamos arrastrando?
      let lastClickTime = 0; // para doble click
      let lastClickCell = { x: -1, y: -1 }; // para doble click
      let isSelecting = false;
      let selectionStart = null;
      let selectionEnd = null;
      let isMovingSelection = false;
      let moveStartCell = null;
      let originalPositions = [];
      
      p.setup = () => {
        // p5: una vez
        p.createCanvas(WIDTH, HEIGHT); // crear canvas
        p.frameRate(60); // fps
        
        // Sacamos el menu del click derecho (molesta en el editor)
        const canvas = document.querySelector('.editor-canvas canvas');
        if (canvas) {
          canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
          });
        }
      };
      
      p.draw = () => {
        // p5: en loop
        p.background(15, 15, 30); // fondo
        
        if (mode === 'edit') drawEditMode(p);
        if (mode === 'play') drawPlayMode(p);
      };
      
      const drawEditMode = (p) => {
        drawGrid(p); // grilla
        level.draw(p); // objetos del nivel
        
        selectedBlocksRef.current.forEach(obj => {
          p.noFill();
          p.stroke(139, 92, 246);
          p.strokeWeight(3);
          p.rect(obj.x, obj.y, GRID_SIZE, GRID_SIZE);
        });
        
        if (isSelecting && selectionStart && selectionEnd) {
          const left = Math.min(selectionStart.x, selectionEnd.x);
          const top = Math.min(selectionStart.y, selectionEnd.y);
          const right = Math.max(selectionStart.x, selectionEnd.x) + GRID_SIZE;
          const bottom = Math.max(selectionStart.y, selectionEnd.y) + GRID_SIZE;
          p.fill(139, 92, 246, 40);
          p.stroke(139, 92, 246, 180);
          p.strokeWeight(2);
          p.rect(left, top, right - left, bottom - top);
        }
        
        // celda marcada
        if (hoveredCell.x >= 0 && hoveredCell.y >= 0) {
          p.noFill();
          p.stroke(139, 92, 246);
          p.strokeWeight(2);
          p.rect(hoveredCell.x, hoveredCell.y, GRID_SIZE, GRID_SIZE);
          
          // preview del objeto
          if (selectedTool && selectedTool !== 'erase') {
            p.push();
            p.fill(255, 255, 255, 100);
            drawToolPreview(p, selectedTool, hoveredCell.x, hoveredCell.y);
            p.pop();
          }
        }
        
        // texto de ayuda
        p.push();
        p.fill(255, 255, 255, 150);
        p.noStroke();
        p.textSize(12);
        p.textAlign(p.LEFT);
        p.text('Click para colocar | Click derecho para borrar', 10, HEIGHT - 10);
        p.pop();
      };
      
      const drawPlayMode = (p) => {
        // Si el engine no existe, lo creamos una vez
        if (!gameEngineRef.current) {
          const validation = level.validate(); // tiene spawn y salida?
          if (validation.valid) {
            gameEngineRef.current = new GameEngine(level, characterData, p); // arrancar juego
          } else {
            // si es invalido, volvemos a edit
            console.error('Nivel invalido:', validation.errors);
            onModeChange('edit');
            return;
          }
        }
        
        const engine = gameEngineRef.current; // alias corto
        if (engine) {
          engine.handleInput();
          engine.update();
          engine.draw(p);
          
          updateCamera(engine.player); // seguir al jugador con scroll
        }
      };
      
      const updateCamera = (player) => {
        if (!player || !containerRef.current) return; // si no hay player o contenedor, no hay camara
        
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const targetScrollX = player.x + player.width / 2 - containerWidth / 2;
        const targetScrollY = player.y + player.height / 2 - containerHeight / 2;
        
        const smoothness = 0.1;
        const currentScrollX = container.scrollLeft;
        const currentScrollY = container.scrollTop;
        
        container.scrollLeft = currentScrollX + (targetScrollX - currentScrollX) * smoothness;
        container.scrollTop = currentScrollY + (targetScrollY - currentScrollY) * smoothness;
      };
      
      const drawGrid = (p) => {
        p.stroke(255, 255, 255, 20);
        p.strokeWeight(1);
        
        // Lineas verticales
        for (let x = 0; x <= WIDTH; x += GRID_SIZE) {
          p.line(x, 0, x, HEIGHT);
        }
        
        // Lineas horizontales
        for (let y = 0; y <= HEIGHT; y += GRID_SIZE) {
          p.line(0, y, WIDTH, y);
        }
      };
      
      const drawToolPreview = (p, tool, x, y) => {
        const tempObj = createTempObject(tool, x, y);
        if (tempObj) {
          p.push();
          p.tint(255, 255, 255, 100);
          tempObj.draw(p);
          p.pop();
        }
      };
      
      const createTempObject = (tool, x, y) => {
        // Importar dinamicamente para preview
        switch (tool) {
          case 'block':
            return { draw: (p) => {
              switch(selectedBlockType) {
                case 'stone':
                  p.fill(90, 90, 90, 100);
                  p.stroke(120, 120, 120, 150);
                  break;
                case 'metal':
                  p.fill(150, 150, 170, 100);
                  p.stroke(180, 180, 200, 150);
                  break;
                case 'ice':
                  p.fill(200, 230, 255, 120);
                  p.stroke(150, 200, 255, 150);
                  break;
                case 'wood':
                  p.fill(139, 90, 60, 100);
                  p.stroke(110, 70, 45, 150);
                  break;
                default:
                  p.fill(60, 60, 80, 100);
                  p.stroke(100, 100, 120, 150);
              }
              p.strokeWeight(2);
              p.rect(x, y, GRID_SIZE, GRID_SIZE);
            }};
          case 'spike':
            return { draw: (p) => {
              p.fill(200, 50, 50, 100);
              p.stroke(255, 100, 100, 150);
              p.strokeWeight(2);
              for (let i = 0; i < 3; i++) {
                const offsetX = i * 13 + 7;
                p.triangle(
                  x + offsetX - 6, y + GRID_SIZE,
                  x + offsetX, y + 8,
                  x + offsetX + 6, y + GRID_SIZE
                );
              }
            }};
          case 'double_jump':
            return { draw: (p) => {
              const cx = x + GRID_SIZE / 2;
              const cy = y + GRID_SIZE / 2;
              p.noStroke();
              p.fill(100, 180, 255, 120);
              p.circle(cx, cy, 28);
              p.fill(255);
              p.textAlign(p.CENTER, p.CENTER);
              p.textSize(12);
              p.text('2x', cx, cy);
            }};
          case 'water':
            return { draw: (p) => {
              p.fill(50, 120, 200, 120);
              p.stroke(100, 150, 220, 150);
              p.strokeWeight(2);
              p.rect(x, y, GRID_SIZE, GRID_SIZE);
            }};
          case 'lava':
            return { draw: (p) => {
              p.fill(200, 50, 0, 120);
              p.stroke(255, 100, 0, 150);
              p.strokeWeight(2);
              p.rect(x, y, GRID_SIZE, GRID_SIZE);
            }};
          case 'falling_block':
            return { draw: (p) => {
              p.fill(150, 70, 70, 100);
              p.stroke(180, 90, 90, 150);
              p.strokeWeight(2);
              p.rect(x, y, GRID_SIZE, GRID_SIZE);
            }};
          case 'key':
            return { draw: (p) => {
              let color = selectedKeyType === 'circle' ? [100, 150, 255] : 
                         selectedKeyType === 'square' ? [255, 200, 50] : [255, 100, 150];
              p.fill(color[0], color[1], color[2], 120);
              p.stroke(color[0] - 30, color[1] - 30, color[2] - 30, 150);
              p.strokeWeight(2);
              p.circle(x + GRID_SIZE/2, y + GRID_SIZE/2, 25);
            }};
          case 'locked_door':
            return { draw: (p) => {
              let color = selectedKeyType === 'circle' ? [100, 150, 255] : 
                         selectedKeyType === 'square' ? [255, 200, 50] : [255, 100, 150];
              const cx = x + GRID_SIZE / 2;
              const cy = y + GRID_SIZE / 2;

              // Marco
              p.noFill();
              p.stroke(color[0], color[1], color[2], 150);
              p.strokeWeight(3);
              p.rect(x, y, GRID_SIZE, GRID_SIZE);

              // Forma de la puerta
              p.fill(color[0], color[1], color[2], 120);
              p.stroke(color[0] - 30, color[1] - 30, color[2] - 30, 150);
              p.strokeWeight(3);

              if (selectedKeyType === 'circle') {
                p.circle(cx, cy, 34);
              } else if (selectedKeyType === 'square') {
                p.rectMode(p.CENTER);
                p.rect(cx, cy, 32, 32, 6);
                p.rectMode(p.CORNER);
              } else {
                p.triangle(cx, cy - 18, cx - 18, cy + 18, cx + 18, cy + 18);
              }
            }};
          case 'enemy':
            return { draw: (p) => {
              p.fill(150, 50, 50, 120);
              p.stroke(100, 30, 30, 150);
              p.strokeWeight(2);
              p.circle(x + GRID_SIZE/2, y + GRID_SIZE/2, 30);
            }};
          case 'character_gate':
            return { draw: (p) => {
              let color, symbolShape;
              switch(selectedCharacterType) {
                case 'boxy':
                  color = [139, 92, 246];
                  symbolShape = 'square';
                  break;
                case 'isquio':
                  color = [168, 85, 247];
                  symbolShape = 'triangle';
                  break;
                case 'gordo':
                  color = [6, 182, 212];
                  symbolShape = 'circle';
                  break;
                default:
                  color = [200, 200, 200];
                  symbolShape = 'square';
              }
              
              p.noFill();
              p.stroke(color[0], color[1], color[2], 150);
              p.strokeWeight(3);
              p.rect(x, y, GRID_SIZE, GRID_SIZE);
              
              const centerX = x + GRID_SIZE / 2;
              const centerY = y + GRID_SIZE / 2;
              p.fill(color[0], color[1], color[2], 150);
              p.stroke(color[0], color[1], color[2], 200);
              p.strokeWeight(2);
              
              if (symbolShape === 'square') {
                p.rectMode(p.CENTER);
                p.rect(centerX, centerY, 18, 18);
                p.rectMode(p.CORNER);
              } else if (symbolShape === 'triangle') {
                p.triangle(centerX, centerY - 10, centerX - 10, centerY + 10, centerX + 10, centerY + 10);
              } else if (symbolShape === 'circle') {
                p.circle(centerX, centerY, 18);
              }
            }};
          case 'switch_platform':
            return { draw: (p) => {
              p.fill(100, 100, 150, 120);
              p.stroke(150, 150, 200, 150);
              p.strokeWeight(2);
              p.rect(x, y, GRID_SIZE, GRID_SIZE);
            }};
          case 'double_jump':
            return { draw: (p) => {
              const cx = x + GRID_SIZE / 2;
              const cy = y + GRID_SIZE / 2;
              const pulse = Math.sin(p.frameCount * 0.08) * 0.3 + 0.7;
              p.noStroke();
              p.fill(100, 180, 255, 120);
              p.circle(cx, cy, 28);
              p.fill(100, 180, 255, 180 * pulse);
              p.circle(cx, cy, 18);
              p.fill(255);
              p.textAlign(p.CENTER, p.CENTER);
              p.textSize(10);
              p.text('2x', cx, cy);
            }};
          case 'flamethrower':
            return { draw: (p) => {
              p.fill(80, 80, 90, 180);
              p.stroke(120, 120, 140, 200);
              p.strokeWeight(2);
              p.rect(x, y, GRID_SIZE, GRID_SIZE);
              p.noStroke();
              p.fill(255, 100, 60, 120);
              p.rect(x + GRID_SIZE, y, GRID_SIZE * 3, GRID_SIZE);
            }};
          case 'spawn':
            return { draw: (p) => {
              p.fill(100, 100, 255, 100);
              p.stroke(150, 150, 255, 150);
              p.strokeWeight(2);
              p.rect(x, y, GRID_SIZE, GRID_SIZE);
            }};
          case 'door':
            return { draw: (p) => {
              p.fill(100, 200, 100, 100);
              p.stroke(150, 255, 150, 150);
              p.strokeWeight(3);
              p.rect(x, y, GRID_SIZE, GRID_SIZE);
            }};
          case 'coin':
            return { draw: (p) => {
              p.fill(255, 215, 0, 150);
              p.stroke(255, 180, 0, 200);
              p.strokeWeight(3);
              p.circle(x + GRID_SIZE/2, y + GRID_SIZE/2, 25);
            }};
          default:
            return null;
        }
      };
      
      p.mouseMoved = () => {
        if (mode === 'edit') updateHoveredCell(p); // solo en edit
      };
      
      p.mouseDragged = () => {
        if (mode === 'edit' && isDragging) {
          updateHoveredCell(p); // refrescar celda
          if (p.mouseButton === p.LEFT && selectedTool) {
            if (selectedTool === 'erase') {
              handleEraseTool(p);
            } else {
              handlePlaceTool(p);
            }
          } else if (p.mouseButton === p.RIGHT) {
            // click derecho arrastrando = borrar
            handleEraseTool(p);
          }
        }
        
        if (mode === 'edit' && selectedTool === 'select') {
          updateHoveredCell(p);
          if (p.mouseButton === p.LEFT) {
            if (isSelecting) {
              selectionEnd = { x: hoveredCell.x, y: hoveredCell.y };
            } else if (isMovingSelection && moveStartCell) {
              const dx = hoveredCell.x - moveStartCell.x;
              const dy = hoveredCell.y - moveStartCell.y;
              const snappedDX = Math.round(dx / GRID_SIZE) * GRID_SIZE;
              const snappedDY = Math.round(dy / GRID_SIZE) * GRID_SIZE;
              selectedBlocksRef.current.forEach((obj, idx) => {
                const base = originalPositions[idx];
                let nx = base.x + snappedDX;
                let ny = base.y + snappedDY;
                nx = Math.max(0, Math.min(WIDTH - GRID_SIZE, nx));
                ny = Math.max(0, Math.min(HEIGHT - GRID_SIZE, ny));
                obj.x = nx;
                obj.y = ny;
              });
            }
          }
          return false;
        }
      };
      
      p.mousePressed = () => {
        if (mode === 'edit') {
          isDragging = true; // empezamos drag
          
          if (selectedTool === 'select') {
            updateHoveredCell(p);
            if (p.mouseButton === p.LEFT) {
              const onSelected = selectedBlocksRef.current.some(b => b.x === hoveredCell.x && b.y === hoveredCell.y);
              if (onSelected && selectedBlocksRef.current.length > 0) {
                isMovingSelection = true;
                moveStartCell = { x: hoveredCell.x, y: hoveredCell.y };
                originalPositions = selectedBlocksRef.current.map(b => ({ x: b.x, y: b.y }));
              } else {
                isSelecting = true;
                selectionStart = { x: hoveredCell.x, y: hoveredCell.y };
                selectionEnd = { x: hoveredCell.x, y: hoveredCell.y };
                selectedBlocksRef.current = [];
              }
            } else if (p.mouseButton === p.RIGHT) {
              const onSelected = selectedBlocksRef.current.some(b => b.x === hoveredCell.x && b.y === hoveredCell.y);
              if (onSelected && selectedBlocksRef.current.length > 0) {
                setChangeTypeOpen(false);
                setContextMenu({ visible: true, x: p.mouseX, y: p.mouseY });
              }
            }
            return false;
          }
          
          if (p.mouseButton === p.LEFT && selectedTool) {
            // doble click en spike = rotar
            const currentTime = Date.now();
            const isSameCell = hoveredCell.x === lastClickCell.x && hoveredCell.y === lastClickCell.y;
            const isDoubleClick = currentTime - lastClickTime < 300 && isSameCell;
            
            if (isDoubleClick) {
              const obj = level.getObjectAt(hoveredCell.x, hoveredCell.y);
              if (obj && (obj.type === 'spike' || obj.type === 'flamethrower') && obj.rotate) {
                obj.rotate();
              }
              lastClickTime = 0; // corta el combo
            } else {
              if (selectedTool === 'erase') {
                handleEraseTool(p);
              } else {
                handlePlaceTool(p);
              }
              lastClickTime = currentTime;
              lastClickCell = { x: hoveredCell.x, y: hoveredCell.y };
            }
          } else if (p.mouseButton === p.RIGHT) {
            // click derecho = borrar
            handleEraseTool(p);
          }
        }
        
        return false; // p5: evitar scroll/seleccion rara
      };
      
      p.mouseReleased = () => {
        if (selectedTool === 'select') {
          if (isSelecting && selectionStart && selectionEnd) {
            const left = Math.min(selectionStart.x, selectionEnd.x);
            const top = Math.min(selectionStart.y, selectionEnd.y);
            const right = Math.max(selectionStart.x, selectionEnd.x) + GRID_SIZE;
            const bottom = Math.max(selectionStart.y, selectionEnd.y) + GRID_SIZE;
            const blocks = level.getBlocks ? level.getBlocks() : level.objects.filter(obj => obj.type === 'block');
            selectedBlocksRef.current = blocks.filter(b => b.x >= left && b.x < right && b.y >= top && b.y < bottom);
          }
          isSelecting = false;
          selectionStart = null;
          selectionEnd = null;
          isMovingSelection = false;
          moveStartCell = null;
          originalPositions = [];
          return false;
        } else {
          isDragging = false;
        }
      };
      
      const updateHoveredCell = (p) => {
        // pasamos mouseX/mouseY a una celda alineada al grid
        if (p.mouseX >= 0 && p.mouseX < WIDTH && p.mouseY >= 0 && p.mouseY < HEIGHT) {
          hoveredCell.x = Math.floor(p.mouseX / GRID_SIZE) * GRID_SIZE;
          hoveredCell.y = Math.floor(p.mouseY / GRID_SIZE) * GRID_SIZE;
        } else {
          hoveredCell.x = -1;
          hoveredCell.y = -1;
        }
      };
      
      const handlePlaceTool = (p) => {
        if (hoveredCell.x >= 0 && hoveredCell.y >= 0) {
          // si ya hay algo en la celda, no ponemos otro
          const existing = level.getObjectAt(hoveredCell.x, hoveredCell.y);
          if (!existing) {
            // algunos objetos usan subtipo (material / forma / personaje)
            if (selectedTool === 'block') {
              level.addObject(selectedTool, hoveredCell.x, hoveredCell.y, selectedBlockType);
            } else if (selectedTool === 'key' || selectedTool === 'locked_door') {
              level.addObject(selectedTool, hoveredCell.x, hoveredCell.y, selectedKeyType);
            } else if (selectedTool === 'character_gate') {
              level.addObject(selectedTool, hoveredCell.x, hoveredCell.y, selectedCharacterType);
            } else if (selectedTool === 'flamethrower') {
              level.addObject(selectedTool, hoveredCell.x, hoveredCell.y, selectedFlameInterval);
            } else {
              level.addObject(selectedTool, hoveredCell.x, hoveredCell.y);
            }
          }
        }
      };
      
      const handleEraseTool = (p) => {
        if (hoveredCell.x >= 0 && hoveredCell.y >= 0) {
          level.removeObjectAt(hoveredCell.x, hoveredCell.y);
        }
      };
      
      // teclas rapidas del modo play
      p.keyPressed = () => {
        if (mode === 'play') {
          // R = reiniciar intento
          if (p.key === 'r' || p.key === 'R') {
            if (gameEngineRef.current) {
              gameEngineRef.current.reset();
            }
          }
          
          // ESC = volver al editor
          if (p.keyCode === p.ESCAPE) {
            gameEngineRef.current = null; // Limpiar engine
            onModeChange('edit');
          }
        }
        
        return false;
      };
    };
    
    if (canvasRef.current) {
      // Limpiar instancia anterior
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
      
      // Crear nueva instancia
      p5Instance.current = new p5(sketch, canvasRef.current);
    }
    
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, [level, selectedTool, selectedBlockType, mode, onModeChange, characterData]);
  
  if (!level) {
    return (
      <div className="editor-canvas-container">
        <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
          Cargando nivel...
        </div>
      </div>
    );
  }
  
  return (
    <div ref={containerRef} className={`editor-canvas-container ${selectedTool === 'select' ? 'select-mode' : ''}`} data-level-size={level.size}>
      {contextMenu.visible && (
        <div
          className="editor-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button className="menu-item" onClick={handleDeleteSelected}>Eliminar</button>
          <div className="menu-divider"></div>
          {!changeTypeOpen ? (
            <button className="menu-item" onClick={() => setChangeTypeOpen(true)}>Cambiar tipo</button>
          ) : (
            <div className="menu-types">
              {conversionTypes.map(t => (
                <button key={t.id} className="menu-type" onClick={() => applyChangeType(t.id)}>
                  {t.name}
                </button>
              ))}
            </div>
          )}
          <div className="menu-divider"></div>
          <button className="menu-item" onClick={handleDeselect}>Deseleccionar</button>
        </div>
      )}
      <div ref={canvasRef} className="editor-canvas"></div>
    </div>
  );
};
