// Motor de físicas optimizado
export class PhysicsEngine {
  constructor(gridSize = 40) {
    this.gridSize = gridSize;
  }
  
  // Colisión AABB optimizada
  checkCollision(bounds1, bounds2) {
    return (
      bounds1.left < bounds2.right &&
      bounds1.right > bounds2.left &&
      bounds1.top < bounds2.bottom &&
      bounds1.bottom > bounds2.top
    );
  }
  
  // Resolver colisiones con bloques
  resolveBlockCollision(player, block) {
    const playerBounds = player.getBounds();
    const blockBounds = block.getBounds();
    
    if (!this.checkCollision(playerBounds, blockBounds)) {
      return false;
    }
    
    // Calcular overlaps
    const overlapLeft = playerBounds.right - blockBounds.left;
    const overlapRight = blockBounds.right - playerBounds.left;
    const overlapTop = playerBounds.bottom - blockBounds.top;
    const overlapBottom = blockBounds.bottom - playerBounds.top;
    
    // Encontrar el menor overlap
    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
    
    // Resolver colisión por el lado con menor overlap
    if (minOverlap === overlapTop && player.velocityY > 0) {
      // Colisión desde arriba (jugador cae sobre bloque)
      player.y = blockBounds.top - player.height;
      player.setGrounded();
      return true;
    } else if (minOverlap === overlapBottom && player.velocityY < 0) {
      // Colisión desde abajo (jugador salta contra bloque)
      player.y = blockBounds.bottom;
      player.velocityY = 0;
      return true;
    } else if (minOverlap === overlapLeft) {
      // Colisión desde la izquierda
      player.x = blockBounds.left - player.width;
      player.velocityX = 0;
      return true;
    } else if (minOverlap === overlapRight) {
      // Colisión desde la derecha
      player.x = blockBounds.right;
      player.velocityX = 0;
      return true;
    }
    
    return false;
  }
  
  // Verificar colisión con pinchos
  checkSpikeCollision(player, spike) {
    const playerBounds = player.getBounds();
    const spikeBounds = spike.getBounds();
    
    // Hacer hitbox de pinchos un poco más pequeña para mejor jugabilidad
    const spikeHitbox = {
      left: spikeBounds.left + 5,
      right: spikeBounds.right - 5,
      top: spikeBounds.top + 5,
      bottom: spikeBounds.bottom - 5
    };
    
    return this.checkCollision(playerBounds, spikeHitbox);
  }
  
  // Verificar colisión con puerta
  checkDoorCollision(player, door) {
    const playerBounds = player.getBounds();
    const doorBounds = door.getBounds();
    
    return this.checkCollision(playerBounds, doorBounds);
  }
  
  // Verificar colisión con moneda
  checkCoinCollision(player, coin) {
    if (coin.collected) return false;
    
    const playerBounds = player.getBounds();
    const coinBounds = coin.getBounds();
    
    // Hitbox más pequeña para la moneda (solo el centro)
    const coinHitbox = {
      left: coinBounds.left + 10,
      right: coinBounds.right - 10,
      top: coinBounds.top + 10,
      bottom: coinBounds.bottom - 10
    };
    
    return this.checkCollision(playerBounds, coinHitbox);
  }
  
  // Optimización: usar grid espacial para colisiones
  getNearbyObjects(player, objects, range = 3) {
    const playerGridX = Math.floor(player.x / this.gridSize);
    const playerGridY = Math.floor(player.y / this.gridSize);
    
    return objects.filter(obj => {
      const objGridX = Math.floor(obj.x / this.gridSize);
      const objGridY = Math.floor(obj.y / this.gridSize);
      
      return (
        Math.abs(objGridX - playerGridX) <= range &&
        Math.abs(objGridY - playerGridY) <= range
      );
    });
  }
}
