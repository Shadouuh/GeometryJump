import { createGameObject, Block, Spike, Door, SpawnPoint, Coin, Water, Lava, FallingBlock, Key, LockedDoor, Enemy, CharacterGate, SwitchPlatform, DoubleJumpOrb, Flamethrower } from './GameObject';
import { Background } from './Background';

// Nivel
// - Guarda todo lo que hay en el nivel
// - El editor lo modifica (poner/borrar)
// - El juego lo usa (dibujar y colisiones)
export class Level {
  constructor(data = null) {
    this.objects = [];
    this.coins = []; // Monedas coleccionables
    this.keys = []; // Llaves
    this.enemies = []; // Enemigos
    this.spawnPoint = null;
    this.door = null;
    this.lockedDoors = []; // Puertas bloqueadas
    this.name = 'Nivel Sin Nombre';
    this.author = 'Anónimo';
    this.gridSize = 40;
    this.size = 'medium'; // 'small', 'medium', 'large'
    this.background = new Background('default');
    this.score = 0; // Puntuacion del jugador
    this.keyCounts = { circle: 0, square: 0, triangle: 0 }; // Llaves recolectadas por forma
    
    if (data) {
      this.loadFromJSON(data);
    } else {
      // Nivel por defecto
      this.createDefaultLevel();
    }
  }
  
  createDefaultLevel() {
    // Spawn point
    this.spawnPoint = new SpawnPoint(80, 400);
    
    // Puerta de salida
    this.door = new Door(680, 400);
    
    // Plataforma base
    for (let i = 0; i < 20; i++) {
      this.objects.push(new Block(i * 40, 480));
    }
    
    // Algunas plataformas
    this.objects.push(new Block(200, 400));
    this.objects.push(new Block(240, 400));
    this.objects.push(new Block(400, 360));
    this.objects.push(new Block(440, 360));
    
    // Algunos pinchos
    this.objects.push(new Spike(320, 440));
    this.objects.push(new Spike(360, 440));
  }
  
  addObject(type, x, y, subtype = 'default') {
    // El editor usa esto para poner algo en una celda
    const gridX = Math.floor(x / this.gridSize) * this.gridSize;
    const gridY = Math.floor(y / this.gridSize) * this.gridSize;
    
    let newObject = null;
    
    switch (type) {
      case 'block':
        newObject = new Block(gridX, gridY, subtype);
        this.objects.push(newObject);
        break;
      case 'spike':
        newObject = new Spike(gridX, gridY);
        this.objects.push(newObject);
        break;
      case 'coin':
        newObject = new Coin(gridX, gridY);
        this.coins.push(newObject);
        break;
      case 'spawn':
        this.spawnPoint = new SpawnPoint(gridX, gridY);
        break;
      case 'door':
        this.door = new Door(gridX, gridY);
        break;
      case 'water':
        newObject = new Water(gridX, gridY);
        this.objects.push(newObject);
        break;
      case 'lava':
        newObject = new Lava(gridX, gridY);
        this.objects.push(newObject);
        break;
      case 'falling_block':
        newObject = new FallingBlock(gridX, gridY);
        this.objects.push(newObject);
        break;
      case 'key':
        newObject = new Key(gridX, gridY, subtype);
        this.keys.push(newObject);
        break;
      case 'locked_door':
        newObject = new LockedDoor(gridX, gridY, subtype);
        this.lockedDoors.push(newObject);
        break;
      case 'enemy':
        newObject = new Enemy(gridX, gridY);
        this.enemies.push(newObject);
        break;
      case 'character_gate':
        newObject = new CharacterGate(gridX, gridY, subtype);
        this.objects.push(newObject);
        break;
      case 'switch_platform':
        newObject = new SwitchPlatform(gridX, gridY);
        this.objects.push(newObject);
        break;
      case 'double_jump':
        newObject = new DoubleJumpOrb(gridX, gridY);
        this.objects.push(newObject);
        break;
      case 'flamethrower':
        newObject = new Flamethrower(gridX, gridY, Number(subtype) || 5);
        this.objects.push(newObject);
        break;
    }
    
    return newObject;
  }
  
  removeObjectAt(x, y) {
    // El editor usa esto para borrar lo que haya en esa celda
    const gridX = Math.floor(x / this.gridSize) * this.gridSize;
    const gridY = Math.floor(y / this.gridSize) * this.gridSize;
    
    // Remover de objects
    this.objects = this.objects.filter(obj => {
      return !(obj.x === gridX && obj.y === gridY);
    });
    
    // Remover de coins
    this.coins = this.coins.filter(coin => {
      return !(coin.x === gridX && coin.y === gridY);
    });
    
    // Remover de keys
    this.keys = this.keys.filter(key => {
      return !(key.x === gridX && key.y === gridY);
    });
    
    // Remover de locked doors
    this.lockedDoors = this.lockedDoors.filter(door => {
      return !(door.x === gridX && door.y === gridY);
    });
    
    // Remover de enemies
    this.enemies = this.enemies.filter(enemy => {
      return !(enemy.x === gridX && enemy.y === gridY);
    });
    
    // Remover spawn o door si coincide
    if (this.spawnPoint && this.spawnPoint.x === gridX && this.spawnPoint.y === gridY) {
      this.spawnPoint = null;
    }
    
    if (this.door && this.door.x === gridX && this.door.y === gridY) {
      this.door = null;
    }
  }
  
  getObjectAt(x, y) {
    const gridX = Math.floor(x / this.gridSize) * this.gridSize;
    const gridY = Math.floor(y / this.gridSize) * this.gridSize;
    
    // Buscar en objects
    const found = this.objects.find(obj => obj.x === gridX && obj.y === gridY);
    if (found) return found;
    
    // Buscar en coins
    const coin = this.coins.find(c => c.x === gridX && c.y === gridY);
    if (coin) return coin;
    
    // Buscar en keys
    const key = this.keys.find(k => k.x === gridX && k.y === gridY);
    if (key) return key;
    
    // Buscar en locked doors
    const lockedDoor = this.lockedDoors.find(d => d.x === gridX && d.y === gridY);
    if (lockedDoor) return lockedDoor;
    
    // Buscar en enemies
    const enemy = this.enemies.find(e => e.x === gridX && e.y === gridY);
    if (enemy) return enemy;
    
    // Buscar spawn
    if (this.spawnPoint && this.spawnPoint.x === gridX && this.spawnPoint.y === gridY) {
      return this.spawnPoint;
    }
    
    // Buscar door
    if (this.door && this.door.x === gridX && this.door.y === gridY) {
      return this.door;
    }
    
    return null;
  }
  
  rotateObjectAt(x, y) {
    const obj = this.getObjectAt(x, y);
    if (obj && obj.rotate) {
      obj.rotate();
    }
  }
  
  changeBlockSubtype(x, y, subtype) {
    const gridX = Math.floor(x / this.gridSize) * this.gridSize;
    const gridY = Math.floor(y / this.gridSize) * this.gridSize;
    
    const block = this.objects.find(obj => 
      obj.type === 'block' && obj.x === gridX && obj.y === gridY
    );
    
    if (block) {
      block.subtype = subtype;
    }
  }
  
  clear() {
    this.objects = [];
    this.coins = [];
    this.keys = [];
    this.enemies = [];
    this.lockedDoors = [];
    this.spawnPoint = null;
    this.door = null;
    this.score = 0;
    this.keyCounts = { circle: 0, square: 0, triangle: 0 };
  }
  
  setSize(size) {
    this.size = size;
  }
  
  getSize() {
    return this.size;
  }
  
  getSizeDimensions() {
    switch (this.size) {
      case 'small':
        return { width: 800, height: 600 };
      case 'large':
        return { width: 2400, height: 800 };
      case 'medium':
      default:
        return { width: 1600, height: 600 };
    }
  }
  
  setBackground(type) {
    this.background = new Background(type);
  }
  
  draw(p5, cameraX = 0, cameraY = 0) {
    // Dibujo del nivel (fondo + objetos)
    const { width, height } = this.getSizeDimensions();
    this.background.draw(p5, width, height, cameraX, cameraY);
    
    // Objetos base
    this.objects.forEach(obj => obj.draw(p5));
    
    // Monedas
    this.coins.forEach(coin => coin.draw(p5));
    
    // Llaves
    this.keys.forEach(key => key.draw(p5));
    
    // Puertas bloqueadas
    this.lockedDoors.forEach(door => door.draw(p5));
    
    // Enemigos
    this.enemies.forEach(enemy => enemy.draw(p5));
    
    // Spawn y salida
    if (this.spawnPoint) this.spawnPoint.draw(p5);
    if (this.door) this.door.draw(p5);
  }
  
  getBlocks() {
    return this.objects.filter(obj => obj.type === 'block');
  }
  
  getSpikes() {
    return this.objects.filter(obj => obj.type === 'spike');
  }
  
  getCoins() {
    return this.coins.filter(coin => !coin.collected);
  }
  
  collectCoin(coin) {
    // GameEngine llama esto cuando el jugador toca una moneda
    coin.collect();
    this.score += coin.value;
  }
  
  getKeys() {
    return this.keys.filter(key => !key.collected);
  }
  
  collectKey(key) {
    // GameEngine llama esto cuando el jugador toca una llave
    // Guardamos cantidad por forma (circle/square/triangle)
    key.collect();
    if (this.keyCounts[key.shape] === undefined) {
      this.keyCounts[key.shape] = 0;
    }
    this.keyCounts[key.shape] += 1;
  }
  
  hasKey(shape) {
    return (this.keyCounts?.[shape] || 0) > 0;
  }

  consumeKey(shape) {
    if (!this.hasKey(shape)) return false;
    this.keyCounts[shape] -= 1;
    return true;
  }
  
  getEnemies() {
    return this.enemies;
  }
  
  getLockedDoors() {
    return this.lockedDoors;
  }
  
  unlockDoor(door) {
    // Si hay llave del mismo tipo, consume 1 y abre
    if (!door || !door.shape) return false;
    if (!this.consumeKey(door.shape)) return false;
    door.unlock();
    return true;
  }
  
  getScore() {
    return this.score;
  }
  
  resetCoins() {
    this.coins.forEach(coin => coin.collected = false);
    this.score = 0;
  }
  
  resetKeys() {
    this.keys.forEach(key => key.collected = false);
    this.keyCounts = { circle: 0, square: 0, triangle: 0 };
    this.lockedDoors.forEach(door => door.locked = true);
  }
  
  toJSON() {
    // Pasar el nivel a un objeto simple (para guardar)
    return {
      name: this.name,
      author: this.author,
      gridSize: this.gridSize,
      size: this.size,
      background: this.background.toJSON(),
      spawn: this.spawnPoint ? this.spawnPoint.toJSON() : null,
      door: this.door ? this.door.toJSON() : null,
      objects: this.objects.map(obj => obj.toJSON()),
      coins: this.coins.map(coin => coin.toJSON()),
      keys: this.keys.map(key => key.toJSON()),
      lockedDoors: this.lockedDoors.map(door => door.toJSON()),
      enemies: this.enemies.map(enemy => enemy.toJSON())
    };
  }
  
  loadFromJSON(data) {
    // Cargar el nivel desde datos guardados
    this.name = data.name || 'Nivel Sin Nombre';
    this.author = data.author || 'Anónimo';
    this.gridSize = data.gridSize || 40;
    this.size = data.size || 'medium';
    
    // Fondo
    if (data.background) {
      this.background = Background.fromJSON(data.background);
    } else {
      this.background = new Background('default');
    }
    
    // Borramos lo que habia antes
    this.clear();
    
    // Spawn
    if (data.spawn) {
      this.spawnPoint = new SpawnPoint(data.spawn.x, data.spawn.y);
    }
    
    // Salida
    if (data.door) {
      this.door = new Door(data.door.x, data.door.y);
    }
    
    // Objetos
    if (data.objects) {
      data.objects.forEach(objData => {
        const obj = createGameObject(objData);
        if (obj) {
          this.objects.push(obj);
        }
      });
    }
    
    // Monedas
    if (data.coins) {
      data.coins.forEach(coinData => {
        const coin = createGameObject(coinData);
        if (coin) {
          this.coins.push(coin);
        }
      });
    }

    // Llaves
    if (data.keys) {
      data.keys.forEach(keyData => {
        const key = createGameObject(keyData);
        if (key) {
          this.keys.push(key);
        }
      });
    }

    // Puertas bloqueadas
    if (data.lockedDoors) {
      data.lockedDoors.forEach(doorData => {
        const door = createGameObject(doorData);
        if (door) {
          this.lockedDoors.push(door);
        }
      });
    }

    // Enemigos
    if (data.enemies) {
      data.enemies.forEach(enemyData => {
        const enemy = createGameObject(enemyData);
        if (enemy) {
          this.enemies.push(enemy);
        }
      });
    }
  }
  
  exportJSON() {
    return JSON.stringify(this.toJSON(), null, 2);
  }
  
  static importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      return new Level(data);
    } catch (error) {
      console.error('Error al importar nivel:', error);
      return null;
    }
  }
  
  validate() {
    // Regla simple: tiene que haber spawn y salida
    const errors = [];
    
    if (!this.spawnPoint) {
      errors.push('Falta punto de inicio');
    }
    
    if (!this.door) {
      errors.push('Falta puerta de salida');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
