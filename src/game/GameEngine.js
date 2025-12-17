import { Player } from './Player';
import { PhysicsEngine } from './PhysicsEngine';
import { InputController } from './InputController';
import characterService from '../services/characterService';

// GameEngine
// - Maneja el juego cuando estamos en play
// - Loop por frame:
//   1) handleInput() -> lee teclas
//   2) update() -> mueve y choca
//   3) draw() -> solo dibuja
export class GameEngine {
  constructor(level, characterData, p5Instance) {
    this.level = level;
    this.characterData = characterData;
    this.p5 = p5Instance;
    this.physicsEngine = new PhysicsEngine(level.gridSize);
    this.inputController = new InputController(p5Instance);
    
    this.player = null;
    this.gameState = 'ready'; // ready, playing, won, lost
    this.startTime = null;
    this.endTime = null;
    
    this.availableCharacterIds = characterService.getAllCharacters().map(c => c.id);
    const initialId = characterData?.id || 'boxy';
    const initialIndex = this.availableCharacterIds.indexOf(initialId);
    this.currentCharacterIndex = initialIndex >= 0 ? initialIndex : 0;
    this.onSwitchPlatform = false;

    this.characterSelectOpen = false;
    this.eWasDown = false;
    this.mouseWasDown = false;
    this.digitWasDown = new Array(this.availableCharacterIds.length).fill(false);
    
    this.spawnPlayer();
  }
  
  spawnPlayer() {
    // Crear jugador en el spawn
    const activeId = this.availableCharacterIds[this.currentCharacterIndex] || 'boxy';
    const activeCharacter = characterService.getCharacterById(activeId) || this.characterData;
    if (this.level.spawnPoint) {
      this.player = new Player(
        this.level.spawnPoint.x,
        this.level.spawnPoint.y,
        activeCharacter
      );
    } else {
      // Spawn por defecto
      this.player = new Player(80, 400, activeCharacter);
    }
    this.player.velocityX = 0;
    this.player.velocityY = 0;
    this.player.isInWater = false;
    this.player.isGrounded = false;
    this.player.facingRight = true;
  }

  getActiveCharacter() {
    const id = this.availableCharacterIds[this.currentCharacterIndex] || 'boxy';
    return characterService.getCharacterById(id);
  }

  updateSwitchPlatformState() {
    // Mira si el jugador esta parado sobre una plataforma de cambio
    const switchPlatforms = this.level.objects.filter(obj => obj.type === 'switch_platform');
    this.onSwitchPlatform = false;
    for (const platform of switchPlatforms) {
      if (this.physicsEngine.checkDoorCollision(this.player, platform)) {
        this.onSwitchPlatform = true;
        break;
      }
    }
    if (!this.onSwitchPlatform) {
      // Si salimos de la plataforma, cerramos el selector
      this.characterSelectOpen = false;
    }
  }
  
  start() {
    this.gameState = 'playing';
    this.startTime = Date.now();
  }
  
  reset() {
    // Reset del intento
    this.spawnPlayer();
    this.gameState = 'playing';
    this.startTime = Date.now();
    this.endTime = null;
    this.inputController.reset();
    this.characterSelectOpen = false;
    this.onSwitchPlatform = false;
    this.eWasDown = false;
    this.mouseWasDown = false;
    this.digitWasDown = new Array(this.availableCharacterIds.length).fill(false);
    this.level.resetCoins();
    this.level.resetKeys();
    // Resetear bloques que caen
    this.level.objects.forEach(obj => {
      if (obj.type === 'falling_block' && obj.reset) {
        obj.reset();
      }
    });
  }
  
  update() {
    // update: solo logica (no UI)
    if (this.gameState !== 'playing') return;
    
    if (!this.player || !this.player.isAlive) return;
    
    this.player.update(); // fisica del jugador
    
    const orbs = this.level.objects.filter(obj => obj.type === 'double_jump');
    let nearOrb = false;
    for (const orb of orbs) {
      const pcx = this.player.x + this.player.width / 2;
      const pcy = this.player.y + this.player.height / 2;
      const ocx = orb.x + orb.width / 2;
      const ocy = orb.y + orb.height / 2;
      const dx = pcx - ocx;
      const dy = pcy - ocy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const close = dist < 60;
      if (close) nearOrb = true;
      orb.glow = close ? 1 : 0.5;
    }
    this.player.canDoubleJump = nearOrb;
    
    // Si cae al vacio, pierde
    const { height } = this.level.getSizeDimensions();
    if (this.player.y > height) {
      this.player.die();
      this.gameState = 'lost';
      return;
    }
    
    // Enemigos se mueven solos
    const enemies = this.level.getEnemies();
    enemies.forEach(enemy => {
      if (enemy.update) enemy.update(this.level);
    });
    
    // Bloques que caen se actualizan
    this.level.objects.forEach(obj => {
      if (obj.type === 'falling_block' && obj.update) {
        obj.update();
      }
      if (obj.type === 'flamethrower' && obj.update) {
        obj.update();
      }
    });
    
    // Colisiones con bloques solidos
    const blocks = this.level.objects.filter(obj => 
      obj.type === 'block' || obj.type === 'falling_block'
    );
    const nearbyBlocks = this.physicsEngine.getNearbyObjects(this.player, blocks);
    
    nearbyBlocks.forEach(block => {
      this.physicsEngine.resolveBlockCollision(this.player, block);
      
      // Activar bloque que cae si el jugador lo pisa
      if (block.type === 'falling_block' && !block.triggered && !block.falling) {
        const onTop = this.player.y + this.player.height <= block.y + 5 && 
                     this.player.y + this.player.height > block.y - 5 &&
                     this.player.x + this.player.width > block.x &&
                     this.player.x < block.x + block.width;
        if (onTop && block.trigger) {
          block.trigger();
        }
      }
    });
    
    // Pinchos: si tocas, mueres
    const spikes = this.level.objects.filter(obj => obj.type === 'spike');
    const nearbySpikes = this.physicsEngine.getNearbyObjects(this.player, spikes);
    
    for (const spike of nearbySpikes) {
      if (this.physicsEngine.checkSpikeCollision(this.player, spike)) {
        this.player.die();
        this.gameState = 'lost';
        return;
      }
    }
    
    // Agua: flotación
    const waterBlocks = this.level.objects.filter(obj => obj.type === 'water');
    let inWater = false;
    for (const water of waterBlocks) {
      if (this.physicsEngine.checkCoinCollision(this.player, water)) {
        inWater = true;
        const waterTop = water.y;
        // Amortiguar movimiento horizontal
        this.player.velocityX *= 0.85;
        // Limitar caída y añadir flotación suave
        this.player.velocityY = Math.min(this.player.velocityY, 1.5);
        this.player.velocityY -= 0.2;
        // Si estamos cerca de la superficie, hacer "bobbing" leve
        const feetY = this.player.y + this.player.height;
        if (feetY < waterTop + 4) {
          const bob = Math.sin(this.p5.frameCount * 0.08) * 0.6;
          this.player.y = waterTop - this.player.height + bob;
          this.player.velocityY = 0;
        }
        break;
      }
    }
    // Estado de agua para modificar salto
    this.player.isInWater = inWater;
    
    // Lava: muerte instantanea
    const lavaBlocks = this.level.objects.filter(obj => obj.type === 'lava');
    for (const lava of lavaBlocks) {
      if (this.physicsEngine.checkCoinCollision(this.player, lava)) {
        this.player.die();
        this.gameState = 'lost';
        return;
      }
    }
    
    const flamers = this.level.objects.filter(obj => obj.type === 'flamethrower');
    for (const flam of flamers) {
      if (!flam.on) continue;
      const rects = flam.getFlameRects();
      const pb = this.player.getBounds();
      for (const r of rects) {
        const rb = { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
        if (this.physicsEngine.checkCollision(pb, rb)) {
          this.player.die();
          this.gameState = 'lost';
          return;
        }
      }
    }
    
    // Enemigos: si tocas, mueres
    for (const enemy of enemies) {
      if (this.physicsEngine.checkCoinCollision(this.player, enemy)) {
        this.player.die();
        this.gameState = 'lost';
        return;
      }
    }
    
    // Monedas: suman score
    const coins = this.level.getCoins();
    for (const coin of coins) {
      if (this.physicsEngine.checkCoinCollision(this.player, coin)) {
        this.level.collectCoin(coin);
      }
    }
    
    // Llaves: suman al contador
    const keys = this.level.getKeys();
    for (const key of keys) {
      if (this.physicsEngine.checkCoinCollision(this.player, key)) {
        this.level.collectKey(key);
      }
    }
    
    // Colisiones con puertas bloqueadas (consume 1 llave del tipo correcto)
    const lockedDoors = this.level.getLockedDoors();
    for (const door of lockedDoors) {
      if (door.locked && this.physicsEngine.checkDoorCollision(this.player, door)) {
        // Si no tenemos la llave correcta, la puerta actua como pared
        if (!this.level.unlockDoor(door)) {
          // Bloquear movimiento si no tiene la llave
          this.physicsEngine.resolveBlockCollision(this.player, door);
        }
      } else if (!door.locked) {
        // Puerta abierta, permitir pasar
      }
    }
    
    // Colisiones con pasadizos de personaje
    const characterGates = this.level.objects.filter(obj => obj.type === 'character_gate');
    for (const gate of characterGates) {
      const currentChar = this.getActiveCharacter();
      if (!gate.canPass(currentChar)) {
        // Bloquear si no es el personaje correcto
        if (this.physicsEngine.checkDoorCollision(this.player, gate)) {
          this.physicsEngine.resolveBlockCollision(this.player, gate);
        }
      }
    }
    
    this.updateSwitchPlatformState();
    
    // Colision con puerta de salida
    if (this.level.door) {
      if (this.physicsEngine.checkDoorCollision(this.player, this.level.door)) {
        this.gameState = 'won';
        this.endTime = Date.now();
      }
    }
  }
  
  draw(p5) {
    // draw: solo dibujo
    this.level.draw(p5);
    
    // Dibujar jugador
    if (this.player) {
      this.player.draw(p5);
    }
    
    // UI del juego
    this.drawUI(p5);
  }
  
  drawUI(p5) {
    const { width } = this.level.getSizeDimensions();
    
    // Timer y Score
    if (this.gameState === 'playing' && this.startTime) {
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
      p5.push();
      p5.fill(255);
      p5.textSize(20);
      
      // Timer (izquierda)
      p5.textAlign(p5.LEFT);
      p5.text(`⏱️ ${elapsed}s`, 20, 30);
      
      // Score (derecha)
      p5.textAlign(p5.RIGHT);
      const score = this.level.getScore();
      p5.fill(255, 215, 0);
      p5.text(`★ ${score}`, width - 20, 30);
      
      // Personaje actual
      const currentChar = this.getActiveCharacter();
      p5.textAlign(p5.LEFT);
      p5.fill(255);
      p5.textSize(14);
      p5.text(`👤 ${currentChar?.name || '??'}`, 20, 55);
      
      // Llaves recolectadas
      const kc = this.level.keyCounts || { circle: 0, square: 0, triangle: 0 };
      const totalKeys = (kc.circle || 0) + (kc.square || 0) + (kc.triangle || 0);
      if (totalKeys > 0) {
        p5.fill(100, 150, 255);
        p5.textSize(14);
        p5.text(`🔑 ○${kc.circle || 0} □${kc.square || 0} △${kc.triangle || 0}`, 20, 75);
      }
      
      // Indicador de plataforma de cambio
      if (this.onSwitchPlatform) {
        const playerX = this.player.x + this.player.width / 2;
        const playerY = this.player.y - 26;
        p5.textAlign(p5.CENTER);
        p5.fill(150, 150, 255);
        p5.textSize(14);
        p5.text(this.characterSelectOpen ? '1/2/3 o click para elegir' : 'Presiona E para elegir', playerX, playerY);

        if (this.characterSelectOpen) {
          this.drawCharacterSelector(p5, playerX, playerY - 22);
        }
      }
      
      p5.pop();
    }
    
    // Mensaje de victoria
    if (this.gameState === 'won') {
      const time = ((this.endTime - this.startTime) / 1000).toFixed(2);
      p5.push();
      p5.fill(0, 0, 0, 150);
      p5.rect(0, 0, 800, 600);
      
      p5.fill(100, 255, 100);
      p5.textAlign(p5.CENTER);
      p5.textSize(48);
      p5.text('¡NIVEL COMPLETADO!', 400, 250);
      
      p5.fill(255);
      p5.textSize(24);
      p5.text(`Tiempo: ${time}s`, 400, 300);
      p5.text('Presiona R para reintentar', 400, 340);
      p5.text('Presiona ESC para volver al editor', 400, 370);
      p5.pop();
    }
    
    // Mensaje de derrota
    if (this.gameState === 'lost') {
      p5.push();
      p5.fill(0, 0, 0, 150);
      p5.rect(0, 0, 800, 600);
      
      p5.fill(255, 100, 100);
      p5.textAlign(p5.CENTER);
      p5.textSize(48);
      p5.text('¡GAME OVER!', 400, 250);
      
      p5.fill(255);
      p5.textSize(24);
      p5.text('Presiona R para reintentar', 400, 320);
      p5.text('Presiona ESC para volver al editor', 400, 350);
      p5.pop();
    }
    
    // Instrucciones
    if (this.gameState === 'ready') {
      p5.push();
      p5.fill(255, 255, 255, 200);
      p5.textAlign(p5.CENTER);
      p5.textSize(16);
      p5.text('Presiona ESPACIO para comenzar', 400, 560);
      p5.text('← → para mover | ESPACIO para saltar', 400, 580);
      p5.pop();
    }
  }
  
  /**
   * Procesar input del jugador
   * Usa InputController que detecta teclas con P5.js keyIsDown()
   */
  handleInput() {
    // Input: convierte teclas en acciones
    if (!this.player || !this.player.isAlive) return;
    
    // En ready: SPACE empieza
    if (this.gameState === 'ready') {
      if (this.inputController.isJumpPressed()) {
        this.start();
      }
      return;
    }
    
    // En playing: mover / saltar / selector
    if (this.gameState === 'playing') {
      this.updateSwitchPlatformState();

      // 1) izquierda / derecha
      const horizontalVelocity = this.characterSelectOpen ? 0 : this.inputController.getHorizontalInput(this.player.moveSpeed);
      this.player.setVelocityX(horizontalVelocity);
      
      // 2) salto (solo cuando recien apretas)
      if (!this.characterSelectOpen && this.inputController.isJumpJustPressed()) {
        this.player.tryJump();
      }
      
      // 3) tecla E (abrir/cerrar selector)
      const eDown = this.p5.keyIsDown(69);
      const eJustPressed = eDown && !this.eWasDown;
      this.eWasDown = eDown;

      if (this.onSwitchPlatform && eJustPressed) {
        this.characterSelectOpen = !this.characterSelectOpen;
      }

      if (this.characterSelectOpen) {
        this.handleCharacterSelectorInput();
      }
    }
  }

  setCharacterByIndex(index) {
    // Cambiar personaje sin recrear player (solo cambia stats)
    if (index < 0 || index >= this.availableCharacterIds.length) return;
    this.currentCharacterIndex = index;
    const newChar = this.getActiveCharacter();
    if (newChar && this.player?.setCharacterData) {
      this.player.setCharacterData(newChar);
    }
    this.characterSelectOpen = false;
  }

  handleCharacterSelectorInput() {
    const count = this.availableCharacterIds.length;
    for (let i = 0; i < count; i++) {
      const code = 49 + i;
      const down = this.p5.keyIsDown(code);
      const just = down && !this.digitWasDown[i];
      this.digitWasDown[i] = down;
      if (just) this.setCharacterByIndex(i);
    }
    
    const mouseDown = this.p5.mouseIsPressed;
    const mouseJust = mouseDown && !this.mouseWasDown;
    this.mouseWasDown = mouseDown;
    if (mouseJust) {
      const playerX = this.player.x + this.player.width / 2;
      const playerY = this.player.y - 48;
      const hit = this.getCharacterSelectorHitIndex(playerX, playerY);
      if (hit !== null) {
        this.setCharacterByIndex(hit);
      }
    }
  }

  drawCharacterSelector(p5, x, y) {
    const count = this.availableCharacterIds.length;
    const w = count * 70 + 20;
    const h = 44;
    const x0 = x - w / 2;
    const y0 = y - h;

    p5.push();
    p5.noStroke();
    p5.fill(10, 10, 20, 200);
    p5.rect(x0, y0, w, h, 10);
    p5.stroke(139, 92, 246, 120);
    p5.noFill();
    p5.rect(x0, y0, w, h, 10);

    const options = this.availableCharacterIds.map((id, idx) => {
      const ch = characterService.getCharacterById(id);
      let shape = 'square';
      if (ch?.type === 'triangle' || ch?.type === 'isosceles') shape = 'triangle';
      else if (ch?.type === 'circle') shape = 'circle';
      else if (ch?.type === 'rhombus') shape = 'rhombus';
      else if (ch?.type === 'rectangle') shape = 'rectangle';
      else shape = 'square';
      return { name: ch?.name || id, color: ch?.color || '#ffffff', shape, key: String(idx + 1) };
    });

    for (let i = 0; i < options.length; i++) {
      const ox = x0 + 10 + i * 70;
      const oy = y0 + 8;
      const active = i === this.currentCharacterIndex;

      p5.noStroke();
      p5.fill(active ? 255 : 255, active ? 255 : 255, active ? 255 : 255, active ? 35 : 15);
      p5.rect(ox, oy, 60, 28, 8);

      p5.fill(options[i].color);
      p5.stroke(255, 180);
      p5.strokeWeight(1.5);

      const cx = ox + 14;
      const cy = oy + 14;
      if (options[i].shape === 'square') {
        p5.rectMode(p5.CENTER);
        p5.rect(cx, cy, 14, 14);
        p5.rectMode(p5.CORNER);
      } else if (options[i].shape === 'triangle') {
        p5.triangle(cx, cy - 8, cx - 8, cy + 8, cx + 8, cy + 8);
      } else if (options[i].shape === 'circle') {
        p5.circle(cx, cy, 14);
      } else if (options[i].shape === 'rhombus') {
        p5.quad(cx, cy - 8, cx + 8, cy, cx, cy + 8, cx - 8, cy);
      } else if (options[i].shape === 'rectangle') {
        p5.rectMode(p5.CENTER);
        p5.rect(cx, cy, 12, 20, 3);
        p5.rectMode(p5.CORNER);
      }

      p5.noStroke();
      p5.fill(255);
      p5.textAlign(p5.LEFT, p5.CENTER);
      p5.textSize(10);
      p5.text(`${options[i].key} ${options[i].name}`, ox + 26, oy + 14);
    }

    p5.pop();
  }

  getCharacterSelectorHitIndex(x, y) {
    const count = this.availableCharacterIds.length;
    const w = count * 70 + 20;
    const h = 44;
    const x0 = x - w / 2;
    const y0 = y - h;
    const mx = this.p5.mouseX;
    const my = this.p5.mouseY;
    if (mx < x0 || mx > x0 + w || my < y0 || my > y0 + h) return null;
    for (let i = 0; i < count; i++) {
      const ox = x0 + 10 + i * 70;
      const oy = y0 + 8;
      if (mx >= ox && mx <= ox + 60 && my >= oy && my <= oy + 28) {
        return i;
      }
    }
    return null;
  }
  
  getCompletionTime() {
    if (this.gameState === 'won' && this.startTime && this.endTime) {
      return (this.endTime - this.startTime) / 1000;
    }
    return null;
  }
}
