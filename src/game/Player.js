// Clase base para jugadores
export class Player {
  constructor(x, y, characterData) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.characterData = characterData;
    
    // Físicas
    this.velocityX = 0;
    this.velocityY = 0;
    this.gravity = 0.8;
    this.jumpForce = -15;
    this.moveSpeed = 5;
    this.friction = 0.85;
    
    // Estado
    this.isGrounded = false;
    this.facingRight = true;
    this.isAlive = true;
    this.isInWater = false;
    this.canDoubleJump = false;
    this.hasDoubleJumped = false;
    
    // Modificadores basados en stats del personaje
    this.applyCharacterStats();
  }
  
  applyCharacterStats() {
    const stats = this.characterData?.stats;
    if (!stats) return;
    // Aplicar modificadores basados en las estadísticas del personaje
    this.moveSpeed = 4 + (stats.speed * 0.5);
    this.jumpForce = -13 - (stats.jump * 0.5);
  }

  setCharacterData(characterData) {
    if (!characterData) return;
    this.characterData = characterData;
    this.applyCharacterStats();
  }
  
  update() {
    if (!this.isAlive) return;
    
    // Aplicar gravedad
    this.velocityY += this.gravity;
    
    // Limitar velocidad vertical para evitar bugs
    this.velocityY = Math.max(-20, Math.min(20, this.velocityY));
    
    // Actualizar posición
    this.x += this.velocityX;
    this.y += this.velocityY;
    
    // Resetear estado de suelo (se establecerá por colisiones)
    this.isGrounded = false;
  }
  
  // Métodos de control simplificados - solo setean velocidad
  setVelocityX(vx) {
    if (!this.isAlive) return;
    this.velocityX = vx;
    if (vx < 0) this.facingRight = false;
    if (vx > 0) this.facingRight = true;
  }
  
  tryJump() {
    if (!this.isAlive) return false;
    if (this.isGrounded) {
      const jumpForce = this.isInWater ? this.jumpForce * 0.7 : this.jumpForce;
      this.velocityY = jumpForce;
      this.isGrounded = false;
      this.hasDoubleJumped = false;
      return true;
    }
    if (this.canDoubleJump && !this.hasDoubleJumped) {
      const jumpForce = this.isInWater ? this.jumpForce * 0.7 : this.jumpForce;
      this.velocityY = jumpForce;
      this.hasDoubleJumped = true;
      return true;
    }
    return false;
  }
  
  setGrounded() {
    this.isGrounded = true;
    this.velocityY = 0;
    this.hasDoubleJumped = false;
  }
  
  die() {
    this.isAlive = false;
    this.velocityX = 0;
    this.velocityY = 0;
  }
  
  reset(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isAlive = true;
    this.isGrounded = false;
    this.canDoubleJump = false;
    this.hasDoubleJumped = false;
  }
  
  draw(p5) {
    if (!this.isAlive) {
      // Dibujar animación de muerte
      p5.push();
      p5.translate(this.x + this.width / 2, this.y + this.height / 2);
      p5.rotate(p5.frameCount * 0.1);
      p5.fill(this.characterData.color);
      p5.stroke(255, 100);
      p5.strokeWeight(2);
      this.drawShape(p5, 0, 0, this.width * 0.8);
      p5.pop();
      return;
    }
    
    p5.push();
    p5.translate(this.x + this.width / 2, this.y + this.height / 2);
    
    // Escalar si está mirando a la izquierda
    if (!this.facingRight) {
      p5.scale(-1, 1);
    }
    
    // Pequeña animación de squash/stretch al saltar
    const squash = this.isGrounded ? 1 : 0.9 + Math.abs(this.velocityY) * 0.01;
    p5.scale(1 / squash, squash);
    
    // Dibujar forma del personaje
    p5.fill(this.characterData.color);
    p5.stroke(255);
    p5.strokeWeight(3);
    this.drawShape(p5, 0, 0, this.width);
    
    // Dibujar cara
    this.drawFace(p5);
    
    p5.pop();
  }
  
  drawShape(p5, x, y, size) {
    const halfSize = size / 2;
    
    switch (this.characterData.type) {
      case 'square':
        p5.rectMode(p5.CENTER);
        p5.rect(x, y, size, size);
        break;
        
      case 'rhombus':
        p5.quad(
          x, y - halfSize,
          x + halfSize, y,
          x, y + halfSize,
          x - halfSize, y
        );
        break;
        
      case 'triangle':
        p5.triangle(
          x, y - halfSize,
          x - halfSize, y + halfSize,
          x + halfSize, y + halfSize
        );
        break;
        
      case 'circle':
        p5.circle(x, y, size);
        break;
        
      case 'isosceles':
        p5.triangle(
          x, y - size * 0.6,
          x - size * 0.4, y + halfSize,
          x + size * 0.4, y + halfSize
        );
        break;
        
      case 'rectangle':
        p5.rectMode(p5.CENTER);
        p5.rect(x, y, size * 0.6, size * 1.2);
        break;
        
      default:
        p5.circle(x, y, size);
    }
  }
  
  drawFace(p5) {
    p5.fill(255);
    p5.noStroke();
    
    const eyeSize = 6;
    const eyeOffsetX = 10;
    const eyeOffsetY = -5;
    
    // Ojos
    p5.circle(-eyeOffsetX, eyeOffsetY, eyeSize);
    p5.circle(eyeOffsetX, eyeOffsetY, eyeSize);
    
    // Pupilas
    p5.fill(0);
    const pupilOffset = this.facingRight ? 2 : -2;
    p5.circle(-eyeOffsetX + pupilOffset, eyeOffsetY, eyeSize * 0.5);
    p5.circle(eyeOffsetX + pupilOffset, eyeOffsetY, eyeSize * 0.5);
    
    // Sonrisa
    p5.noFill();
    p5.stroke(255);
    p5.strokeWeight(2);
    p5.arc(0, 5, 20, 15, 0, p5.PI);
  }
  
  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
      centerX: this.x + this.width / 2,
      centerY: this.y + this.height / 2
    };
  }
}
