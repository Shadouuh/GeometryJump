// Clase base para objetos del nivel
export class GameObject {
  constructor(x, y, type, subtype = 'default') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.subtype = subtype; // Variante del objeto (ej: tipos de bloques)
    this.rotation = 0; // Rotación en grados (0, 90, 180, 270)
    this.width = 40;
    this.height = 40;
  }
  
  draw(p5) {
    // Implementado por subclases
  }
  
  rotate() {
    // Rotar 90 grados
    this.rotation = (this.rotation + 90) % 360;
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
  
  toJSON() {
    return {
      x: this.x,
      y: this.y,
      type: this.type,
      subtype: this.subtype,
      rotation: this.rotation
    };
  }
}

// Bloque sólido con diferentes estilos
export class Block extends GameObject {
  constructor(x, y, subtype = 'default') {
    super(x, y, 'block', subtype);
  }
  
  draw(p5) {
    p5.push();
    
    // Diferentes estilos de bloques
    switch (this.subtype) {
      case 'stone':
        this.drawStoneBlock(p5);
        break;
      case 'metal':
        this.drawMetalBlock(p5);
        break;
      case 'ice':
        this.drawIceBlock(p5);
        break;
      case 'wood':
        this.drawWoodBlock(p5);
        break;
      default:
        this.drawDefaultBlock(p5);
    }
    
    p5.pop();
  }
  
  drawDefaultBlock(p5) {
    p5.fill(60, 60, 80);
    p5.stroke(100, 100, 120);
    p5.strokeWeight(2);
    p5.rect(this.x, this.y, this.width, this.height);
    
    p5.stroke(80, 80, 100);
    p5.strokeWeight(1);
    p5.line(this.x + 10, this.y + 10, this.x + 30, this.y + 10);
    p5.line(this.x + 10, this.y + 30, this.x + 30, this.y + 30);
  }
  
  drawStoneBlock(p5) {
    p5.fill(90, 90, 90);
    p5.stroke(120, 120, 120);
    p5.strokeWeight(2);
    p5.rect(this.x, this.y, this.width, this.height);
    
    // Textura de piedra
    p5.fill(70, 70, 70);
    p5.noStroke();
    p5.circle(this.x + 10, this.y + 10, 8);
    p5.circle(this.x + 30, this.y + 25, 6);
    p5.circle(this.x + 20, this.y + 32, 7);
  }
  
  drawMetalBlock(p5) {
    p5.fill(150, 150, 170);
    p5.stroke(180, 180, 200);
    p5.strokeWeight(2);
    p5.rect(this.x, this.y, this.width, this.height);
    
    // Detalles metálicos
    p5.stroke(200, 200, 220);
    p5.strokeWeight(2);
    p5.line(this.x + 5, this.y + 20, this.x + 35, this.y + 20);
    p5.noStroke();
    p5.fill(180, 180, 200);
    p5.circle(this.x + 10, this.y + 10, 6);
    p5.circle(this.x + 30, this.y + 10, 6);
    p5.circle(this.x + 10, this.y + 30, 6);
    p5.circle(this.x + 30, this.y + 30, 6);
  }
  
  drawIceBlock(p5) {
    p5.fill(200, 230, 255, 200);
    p5.stroke(150, 200, 255);
    p5.strokeWeight(2);
    p5.rect(this.x, this.y, this.width, this.height);
    
    // Cristales de hielo
    p5.stroke(255, 255, 255, 150);
    p5.strokeWeight(2);
    p5.line(this.x + 10, this.y + 10, this.x + 15, this.y + 15);
    p5.line(this.x + 30, this.y + 10, this.x + 25, this.y + 15);
    p5.line(this.x + 20, this.y + 25, this.x + 20, this.y + 35);
  }
  
  drawWoodBlock(p5) {
    p5.fill(139, 90, 60);
    p5.stroke(110, 70, 45);
    p5.strokeWeight(2);
    p5.rect(this.x, this.y, this.width, this.height);
    
    // Vetas de madera
    p5.stroke(110, 70, 45, 100);
    p5.strokeWeight(2);
    for (let i = 0; i < 3; i++) {
      const y = this.y + 10 + i * 10;
      p5.line(this.x + 5, y, this.x + 35, y);
    }
  }
}

// Pincho mortal con rotación (diseño mejorado con efecto 3D)
export class Spike extends GameObject {
  constructor(x, y, rotation = 0) {
    super(x, y, 'spike');
    this.rotation = rotation;
    this.animOffset = Math.random() * 100;
  }
  
  draw(p5) {
    p5.push();
    
    // Rotar desde el centro
    p5.translate(this.x + this.width / 2, this.y + this.height / 2);
    p5.rotate(p5.radians(this.rotation));
    p5.translate(-(this.width / 2), -(this.height / 2));
    
    // Base sólida con efecto 3D
    p5.noStroke();
    p5.fill(50, 50, 60);
    p5.rect(0, 32, this.width, 8);
    
    // Sombra superior de la base
    p5.fill(35, 35, 45);
    p5.rect(0, 32, this.width, 2);
    
    // Sombra inferior de la base
    p5.fill(20, 20, 30, 150);
    p5.rect(2, 38, this.width - 4, 3);
    
    // Pinchos con efecto de peligro y 3D
    const glowIntensity = (Math.sin((p5.frameCount + this.animOffset) * 0.05) + 1) / 2;
    
    // Tres pinchos con gradiente
    for (let i = 0; i < 3; i++) {
      const offsetX = i * 13 + 7;
      
      // Sombra del pincho
      p5.fill(100, 30, 30, 100);
      p5.triangle(
        offsetX - 5, 32,
        offsetX + 1, 10,
        offsetX + 7, 32
      );
      
      // Lado oscuro del pincho (efecto 3D)
      p5.fill(150, 40, 40);
      p5.triangle(
        offsetX, 8,
        offsetX + 6, 32,
        offsetX, 32
      );
      
      // Lado claro del pincho (efecto 3D)
      p5.fill(220, 60 + glowIntensity * 50, 60);
      p5.triangle(
        offsetX - 6, 32,
        offsetX, 8,
        offsetX, 32
      );
      
      // Brillo en la punta
      p5.fill(255, 150 + glowIntensity * 100, 150, 200);
      p5.circle(offsetX, 10, 3);
      
      // Contorno del pincho
      p5.noFill();
      p5.stroke(180, 50 + glowIntensity * 50, 50);
      p5.strokeWeight(1.5);
      p5.triangle(
        offsetX - 6, 32,
        offsetX, 8,
        offsetX + 6, 32
      );
    }
    
    // Línea de separación en la base
    p5.stroke(25, 25, 35);
    p5.strokeWeight(2);
    p5.line(2, 32, this.width - 2, 32);
    
    // Detalles metálicos en la base
    p5.fill(60, 60, 70);
    p5.noStroke();
    p5.rect(5, 35, 2, 3);
    p5.rect(33, 35, 2, 3);
    
    p5.pop();
  }
}

// Puerta de salida
export class Door extends GameObject {
  constructor(x, y) {
    super(x, y, 'door');
    this.isOpen = false;
  }
  
  draw(p5) {
    p5.push();
    
    // Marco de la puerta
    p5.fill(100, 200, 100);
    p5.stroke(150, 255, 150);
    p5.strokeWeight(3);
    p5.rect(this.x, this.y, this.width, this.height);
    
    // Efecto de brillo/portal
    const glowSize = 30 + Math.sin(p5.frameCount * 0.05) * 5;
    p5.fill(150, 255, 150, 100);
    p5.noStroke();
    p5.rectMode(p5.CENTER);
    p5.rect(this.x + this.width / 2, this.y + this.height / 2, glowSize, glowSize);
    
    // Símbolo de salida
    p5.stroke(255);
    p5.strokeWeight(3);
    p5.noFill();
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    p5.line(centerX - 8, centerY, centerX + 8, centerY);
    p5.line(centerX + 8, centerY, centerX + 4, centerY - 6);
    p5.line(centerX + 8, centerY, centerX + 4, centerY + 6);
    
    p5.rectMode(p5.CORNER);
    p5.pop();
  }
}

// Punto de inicio del jugador
export class SpawnPoint extends GameObject {
  constructor(x, y) {
    super(x, y, 'spawn');
  }
  
  draw(p5) {
    p5.push();
    
    // Plataforma de spawn
    p5.fill(100, 100, 255, 100);
    p5.stroke(150, 150, 255);
    p5.strokeWeight(2);
    p5.rect(this.x, this.y, this.width, this.height);
    
    // Efecto de spawn
    const pulseSize = 35 + Math.sin(p5.frameCount * 0.1) * 5;
    p5.noFill();
    p5.stroke(150, 150, 255, 150);
    p5.strokeWeight(2);
    p5.rectMode(p5.CENTER);
    p5.rect(this.x + this.width / 2, this.y + this.height / 2, pulseSize, pulseSize);
    
    // Icono de jugador
    p5.fill(150, 150, 255);
    p5.noStroke();
    p5.circle(this.x + this.width / 2, this.y + this.height / 2, 15);
    
    p5.rectMode(p5.CORNER);
    p5.pop();
  }
}

// Moneda coleccionable
export class Coin extends GameObject {
  constructor(x, y, value = 100) {
    super(x, y, 'coin');
    this.value = value;
    this.collected = false;
    this.animOffset = Math.random() * 100;
  }
  
  collect() {
    this.collected = true;
  }
  
  draw(p5) {
    if (this.collected) return;
    
    p5.push();
    
    // Animación de rotación
    const rotation = (p5.frameCount + this.animOffset) * 0.05;
    const scale = 1 + Math.sin(rotation * 2) * 0.1;
    
    p5.translate(this.x + this.width / 2, this.y + this.height / 2);
    p5.scale(scale);
    
    // Moneda dorada
    p5.fill(255, 215, 0);
    p5.stroke(255, 180, 0);
    p5.strokeWeight(3);
    p5.circle(0, 0, 25);
    
    // Detalles de la moneda
    p5.fill(255, 200, 0);
    p5.noStroke();
    p5.circle(0, 0, 18);
    
    // Símbolo de moneda
    p5.fill(255, 215, 0);
    p5.textSize(20);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text('★', 0, 0);
    
    // Brillo
    p5.fill(255, 255, 255, 150);
    p5.circle(-5, -5, 6);
    
    p5.pop();
  }
  
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value,
      collected: this.collected
    };
  }
}

// Agua - reduce velocidad del jugador
export class Water extends GameObject {
  constructor(x, y) {
    super(x, y, 'water');
  }
  
  draw(p5) {
    p5.push();
    
    // Agua con efecto de olas
    const waveOffset = Math.sin(p5.frameCount * 0.05 + this.x * 0.01) * 2;
    p5.fill(50, 120, 200, 180);
    p5.noStroke();
    p5.rect(this.x, this.y, this.width, this.height);
    
    // Olas en la superficie
    p5.stroke(100, 150, 220, 200);
    p5.strokeWeight(2);
    for (let i = 0; i < this.width; i += 8) {
      const wave = Math.sin((p5.frameCount * 0.05 + i * 0.1)) * 3;
      p5.line(this.x + i, this.y + 5 + wave, this.x + i + 4, this.y + 5 + wave);
    }
    
    // Burbujas
    p5.fill(150, 200, 255, 150);
    p5.noStroke();
    const bubble1 = (p5.frameCount * 0.5 + this.x) % this.height;
    const bubble2 = ((p5.frameCount * 0.3 + this.x * 2) % this.height);
    p5.circle(this.x + 10, this.y + this.height - bubble1, 4);
    p5.circle(this.x + 30, this.y + this.height - bubble2, 3);
    
    p5.pop();
  }
}

// Lava - mata al jugador
export class Lava extends GameObject {
  constructor(x, y) {
    super(x, y, 'lava');
  }
  
  draw(p5) {
    p5.push();
    
    // Base de lava
    p5.fill(200, 50, 0);
    p5.noStroke();
    p5.rect(this.x, this.y, this.width, this.height);
    
    // Efecto de flujo de lava
    const flowOffset = p5.frameCount * 0.1;
    p5.fill(255, 100, 0, 180);
    for (let i = 0; i < 3; i++) {
      const wave = Math.sin(flowOffset + i + this.x * 0.01) * 5;
      p5.ellipse(this.x + 20, this.y + 10 + i * 10 + wave, 30, 8);
    }
    
    // Burbujas de lava
    p5.fill(255, 150, 0);
    const bubble = (p5.frameCount * 0.5 + this.x) % this.height;
    p5.circle(this.x + 15, this.y + this.height - bubble, 5);
    p5.circle(this.x + 25, this.y + this.height - ((bubble + 20) % this.height), 6);
    
    // Brillo en la superficie
    p5.fill(255, 200, 50, 150);
    p5.rect(this.x, this.y, this.width, 3);
    
    p5.pop();
  }
}

// Bloque que cae después de pisarlo
export class FallingBlock extends GameObject {
  constructor(x, y) {
    super(x, y, 'falling_block');
    this.originalX = x;
    this.originalY = y;
    this.triggered = false;
    this.triggerTime = 0;
    this.fallDelay = 1500; // 1.5 segundos
    this.falling = false;
    this.shakeAmount = 0;
  }
  
  trigger() {
    if (!this.triggered) {
      this.triggered = true;
      this.triggerTime = Date.now();
    }
  }
  
  update() {
    if (this.triggered && !this.falling) {
      const elapsed = Date.now() - this.triggerTime;
      if (elapsed >= this.fallDelay) {
        this.falling = true;
      } else {
        // Efecto de temblor antes de caer
        this.shakeAmount = Math.min(elapsed / this.fallDelay * 3, 3);
      }
    }
    
    if (this.falling) {
      this.y += 10; // Caer rápidamente
    }
  }
  
  reset() {
    this.x = this.originalX;
    this.y = this.originalY;
    this.triggered = false;
    this.triggerTime = 0;
    this.falling = false;
    this.shakeAmount = 0;
  }
  
  draw(p5) {
    p5.push();
    
    const shake = this.triggered && !this.falling ? 
      (Math.random() - 0.5) * this.shakeAmount : 0;
    
    // Color que se intensifica antes de caer
    const intensity = this.triggered ? Math.min((Date.now() - this.triggerTime) / this.fallDelay, 1) : 0;
    const red = 80 + intensity * 120;
    
    p5.fill(red, 70, 70);
    p5.stroke(red + 20, 90, 90);
    p5.strokeWeight(2);
    p5.rect(this.x + shake, this.y + shake, this.width, this.height);
    
    // Grietas que aparecen
    if (this.triggered && !this.falling) {
      p5.stroke(40, 40, 40);
      p5.strokeWeight(2);
      p5.line(this.x + 10, this.y, this.x + 15, this.y + this.height);
      p5.line(this.x + 25, this.y, this.x + 20, this.y + this.height);
    }
    
    p5.pop();
  }
  
  toJSON() {
    return {
      ...super.toJSON(),
      triggered: false,
      falling: false
    };
  }
}

// Llave con forma específica
export class Key extends GameObject {
  constructor(x, y, shape = 'circle') {
    super(x, y, 'key', shape);
    this.shape = shape; // 'circle', 'square', 'triangle'
    this.collected = false;
  }
  
  collect() {
    this.collected = true;
  }
  
  draw(p5) {
    if (this.collected) return;
    
    p5.push();
    
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const pulse = 1 + Math.sin(p5.frameCount * 0.1) * 0.1;
    
    p5.translate(centerX, centerY);
    p5.scale(pulse);
    
    // Color según forma
    let color;
    switch(this.shape) {
      case 'circle':
        color = [100, 150, 255];
        break;
      case 'square':
        color = [255, 200, 50];
        break;
      case 'triangle':
        color = [255, 100, 150];
        break;
      default:
        color = [200, 200, 200];
    }
    
    // Brillo de fondo
    p5.fill(color[0], color[1], color[2], 100);
    p5.noStroke();
    p5.circle(0, 0, 35);
    
    // Forma de la llave
    p5.fill(color[0], color[1], color[2]);
    p5.stroke(color[0] - 50, color[1] - 50, color[2] - 50);
    p5.strokeWeight(2);
    
    this.drawKeyShape(p5);
    
    p5.pop();
  }
  
  drawKeyShape(p5) {
    // Mango de la llave (forma geométrica)
    switch(this.shape) {
      case 'circle':
        p5.circle(-5, 0, 12);
        break;
      case 'square':
        p5.rectMode(p5.CENTER);
        p5.rect(-5, 0, 12, 12);
        p5.rectMode(p5.CORNER);
        break;
      case 'triangle':
        p5.triangle(-11, 6, -5, -6, 1, 6);
        break;
    }
    
    // Barra de la llave
    p5.rect(-2, -2, 10, 4);
    
    // Dientes de la llave
    p5.rect(8, -2, 2, 6);
    p5.rect(11, -2, 2, 4);
  }
  
  toJSON() {
    return {
      ...super.toJSON(),
      shape: this.shape,
      collected: this.collected
    };
  }
}

// Puerta bloqueada que requiere llave
export class LockedDoor extends GameObject {
  constructor(x, y, shape = 'circle') {
    super(x, y, 'locked_door', shape);
    this.shape = shape;
    this.locked = true;
  }
  
  unlock() {
    this.locked = false;
  }
  
  draw(p5) {
    p5.push();
    
    // Color según forma y estado
    let color;
    switch(this.shape) {
      case 'circle':
        color = [100, 150, 255];
        break;
      case 'square':
        color = [255, 200, 50];
        break;
      case 'triangle':
        color = [255, 100, 150];
        break;
      default:
        color = [200, 200, 200];
    }
    
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const alpha = this.locked ? 230 : 80;

    // Marco (siempre)
    p5.noFill();
    p5.stroke(color[0], color[1], color[2], this.locked ? 180 : 80);
    p5.strokeWeight(3);
    p5.rect(this.x, this.y, this.width, this.height);

    // Puerta con forma (círculo/cuadrado/triángulo)
    p5.fill(color[0], color[1], color[2], alpha);
    p5.stroke(color[0] - 50, color[1] - 50, color[2] - 50, this.locked ? 220 : 80);
    p5.strokeWeight(3);

    switch (this.shape) {
      case 'circle':
        p5.circle(centerX, centerY, 34);
        break;
      case 'square':
        p5.rectMode(p5.CENTER);
        p5.rect(centerX, centerY, 32, 32, 6);
        p5.rectMode(p5.CORNER);
        break;
      case 'triangle':
        p5.triangle(
          centerX, centerY - 18,
          centerX - 18, centerY + 18,
          centerX + 18, centerY + 18
        );
        break;
      default:
        p5.rectMode(p5.CENTER);
        p5.rect(centerX, centerY, 32, 32, 6);
        p5.rectMode(p5.CORNER);
    }

    if (this.locked) {
      // Símbolo de candado
      p5.fill(50, 50, 60);
      p5.stroke(80, 80, 90);
      p5.strokeWeight(2);
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY + 9, 14, 10, 3);

      p5.noFill();
      p5.arc(centerX, centerY + 4, 12, 12, p5.PI, 0);

      // Forma en el centro del candado
      p5.fill(color[0], color[1], color[2]);
      p5.noStroke();
      this.drawShapeSymbol(p5, centerX, centerY + 9);

      p5.rectMode(p5.CORNER);
    }
    
    p5.pop();
  }
  
  drawShapeSymbol(p5, x, y) {
    switch(this.shape) {
      case 'circle':
        p5.circle(x, y, 6);
        break;
      case 'square':
        p5.rectMode(p5.CENTER);
        p5.rect(x, y, 6, 6);
        p5.rectMode(p5.CORNER);
        break;
      case 'triangle':
        p5.triangle(x, y - 3, x - 3, y + 3, x + 3, y + 3);
        break;
    }
  }
  
  toJSON() {
    return {
      ...super.toJSON(),
      shape: this.shape,
      locked: this.locked
    };
  }
}

// Enemigo que patrulla
export class Enemy extends GameObject {
  constructor(x, y) {
    super(x, y, 'enemy');
    this.velocityX = 2;
    this.direction = 1; // 1 = derecha, -1 = izquierda
  }
  
  update(level) {
    // Mover el enemigo
    this.x += this.velocityX * this.direction;
    
    // Verificar si hay suelo adelante y si hay pared
    const checkX = this.direction === 1 ? this.x + this.width : this.x;
    const checkY = this.y + this.height + 5;
    
    // Verificar pared adelante
    const wallAhead = level.getObjectAt(checkX + this.direction * 40, this.y);
    const isWall = wallAhead && wallAhead.type === 'block';
    
    // Verificar si hay suelo adelante
    const groundAhead = level.getObjectAt(checkX + this.direction * 20, checkY);
    const hasGround = groundAhead && groundAhead.type === 'block';
    
    // Cambiar dirección si encuentra pared o vacío
    if (isWall || !hasGround) {
      this.direction *= -1;
    }
  }
  
  draw(p5) {
    p5.push();
    
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    // Cuerpo del enemigo
    p5.fill(150, 50, 50);
    p5.stroke(100, 30, 30);
    p5.strokeWeight(2);
    p5.circle(centerX, centerY, 30);
    
    // Ojos que miran en la dirección del movimiento
    p5.fill(255, 50, 50);
    p5.noStroke();
    const eyeOffset = this.direction * 4;
    p5.circle(centerX - 6 + eyeOffset, centerY - 5, 8);
    p5.circle(centerX + 6 + eyeOffset, centerY - 5, 8);
    
    // Pupila
    p5.fill(0);
    p5.circle(centerX - 6 + eyeOffset, centerY - 5, 4);
    p5.circle(centerX + 6 + eyeOffset, centerY - 5, 4);
    
    // Pinchos pequeños
    p5.fill(100, 30, 30);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * p5.TWO_PI;
      const px = centerX + Math.cos(angle) * 15;
      const py = centerY + Math.sin(angle) * 15;
      const px2 = centerX + Math.cos(angle) * 20;
      const py2 = centerY + Math.sin(angle) * 20;
      p5.triangle(centerX, centerY, px, py, px2, py2);
    }
    
    p5.pop();
  }
  
  toJSON() {
    return {
      ...super.toJSON(),
      direction: this.direction
    };
  }
}

// Pasadizo que solo permite pasar a ciertos personajes
export class CharacterGate extends GameObject {
  constructor(x, y, requiredCharacter = 'boxy') {
    super(x, y, 'character_gate');
    this.requiredCharacter = requiredCharacter;
  }
  
  canPass(character) {
    return character?.id?.toLowerCase() === this.requiredCharacter.toLowerCase();
  }
  
  draw(p5) {
    p5.push();
    
    // Color según personaje requerido
    let color;
    let symbolShape;
    switch(this.requiredCharacter.toLowerCase()) {
      case 'boxy':
        color = [139, 92, 246]; // Violeta
        symbolShape = 'square';
        break;
      case 'isquio':
        color = [168, 85, 247]; // Púrpura
        symbolShape = 'triangle';
        break;
      case 'gordo':
        color = [6, 182, 212]; // Cyan
        symbolShape = 'circle';
        break;
      default:
        color = [200, 200, 200];
        symbolShape = 'square';
    }
    
    // Marco del pasadizo con brillo
    const pulse = Math.sin(p5.frameCount * 0.05) * 0.3 + 0.7;
    p5.noFill();
    p5.stroke(color[0], color[1], color[2], 200 * pulse);
    p5.strokeWeight(4);
    p5.rect(this.x, this.y, this.width, this.height);
    
    // Marco interno
    p5.stroke(color[0], color[1], color[2], 100);
    p5.strokeWeight(2);
    p5.rect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);
    
    // Líneas de energía
    for (let i = 0; i < 4; i++) {
      const offset = (p5.frameCount * 0.5 + i * 10) % this.height;
      p5.stroke(color[0], color[1], color[2], 80);
      p5.strokeWeight(2);
      p5.line(this.x, this.y + offset, this.x + this.width, this.y + offset);
    }
    
    // Símbolo del personaje requerido
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    p5.fill(color[0], color[1], color[2], 200);
    p5.stroke(color[0] + 40, color[1] + 40, color[2] + 40);
    p5.strokeWeight(2);
    
    if (symbolShape === 'square') {
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY, 18, 18);
      p5.rectMode(p5.CORNER);
    } else if (symbolShape === 'triangle') {
      p5.triangle(
        centerX, centerY - 10,
        centerX - 10, centerY + 10,
        centerX + 10, centerY + 10
      );
    } else if (symbolShape === 'circle') {
      p5.circle(centerX, centerY, 18);
    }
    
    // Nombre del personaje
    p5.fill(255);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(8);
    p5.text(this.requiredCharacter.toUpperCase(), centerX, this.y + this.height - 8);
    
    p5.pop();
  }
  
  toJSON() {
    return {
      ...super.toJSON(),
      requiredCharacter: this.requiredCharacter
    };
  }
}

// Plataforma para cambiar de personaje
export class SwitchPlatform extends GameObject {
  constructor(x, y) {
    super(x, y, 'switch_platform');
  }
  
  draw(p5) {
    p5.push();
    
    // Base de la plataforma
    p5.fill(100, 100, 150);
    p5.stroke(150, 150, 200);
    p5.strokeWeight(3);
    p5.rect(this.x, this.y, this.width, this.height);
    
    // Efecto de brillo
    const pulse = Math.sin(p5.frameCount * 0.05) * 0.3 + 0.7;
    p5.fill(150, 150, 255, pulse * 150);
    p5.noStroke();
    p5.rect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
    
    // Símbolo de cambio
    p5.stroke(255);
    p5.strokeWeight(2);
    p5.noFill();
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    p5.circle(centerX - 8, centerY, 10);
    p5.circle(centerX + 8, centerY, 10);
    
    // Flechas de intercambio
    p5.line(centerX - 3, centerY - 5, centerX + 3, centerY - 5);
    p5.line(centerX + 3, centerY - 5, centerX, centerY - 8);
    p5.line(centerX - 3, centerY + 5, centerX + 3, centerY + 5);
    p5.line(centerX - 3, centerY + 5, centerX, centerY + 8);
    
    // Texto "E"
    p5.fill(255);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(10);
    p5.text('E', centerX, this.y + this.height - 8);
    
    p5.pop();
  }
}

export class DoubleJumpOrb extends GameObject {
  constructor(x, y) {
    super(x, y, 'double_jump');
    this.glow = 0.6;
  }
  
  draw(p5) {
    p5.push();
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const pulse = Math.sin(p5.frameCount * 0.08) * 0.3 + 0.7;
    p5.noStroke();
    p5.fill(100, 180, 255, 120);
    p5.circle(cx, cy, 28);
    const alpha = 140 + (this.glow * 100);
    p5.fill(100, 180, 255, alpha * pulse);
    p5.circle(cx, cy, 18);
    p5.fill(255);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(10);
    p5.text('2x', cx, cy);
    p5.pop();
  }
}

export class Flamethrower extends GameObject {
  constructor(x, y, intervalSeconds = 5) {
    super(x, y, 'flamethrower');
    this.intervalSeconds = intervalSeconds;
    this.baseTime = Date.now();
    this.on = false;
  }
  
  update() {
    const period = this.intervalSeconds * 1000;
    const t = (Date.now() - this.baseTime) % period;
    this.on = t < period / 2;
  }
  
  getFlameRects() {
    const rects = [];
    const size = this.width;
    const dir = ((this.rotation % 360) + 360) % 360;
    for (let i = 1; i <= 3; i++) {
      if (dir === 0) {
        rects.push({ left: this.x + i * size, top: this.y, right: this.x + (i + 1) * size, bottom: this.y + size });
      } else if (dir === 90) {
        rects.push({ left: this.x, top: this.y + i * size, right: this.x + size, bottom: this.y + (i + 1) * size });
      } else if (dir === 180) {
        rects.push({ left: this.x - i * size, top: this.y, right: this.x - (i - 1) * size, bottom: this.y + size });
      } else {
        rects.push({ left: this.x, top: this.y - i * size, right: this.x + size, bottom: this.y - (i - 1) * size });
      }
    }
    return rects;
  }
  
  draw(p5) {
    p5.push();
    p5.fill(80, 80, 90);
    p5.stroke(120, 120, 140);
    p5.strokeWeight(2);
    p5.rect(this.x, this.y, this.width, this.height);
    
    p5.translate(this.x + this.width / 2, this.y + this.height / 2);
    p5.rotate(p5.radians(this.rotation));
    p5.translate(-(this.width / 2), -(this.height / 2));
    
    p5.fill(200, 200, 220);
    p5.rect(this.width - 10, 14, 10, 12);
    
    if (this.on) {
      p5.noStroke();
      p5.fill(255, 100, 60, 180);
      for (let i = 1; i <= 3; i++) {
        p5.rect(this.width - 10 + i * this.width, 0, this.width, this.height);
      }
    }
    
    p5.pop();
  }
  
  toJSON() {
    return {
      ...super.toJSON(),
      intervalSeconds: this.intervalSeconds
    };
  }
}
// Factory para crear objetos desde JSON
export function createGameObject(data) {
  let obj = null;
  
  switch (data.type) {
    case 'block':
      obj = new Block(data.x, data.y, data.subtype || 'default');
      break;
    case 'spike':
      obj = new Spike(data.x, data.y, data.rotation || 0);
      break;
    case 'door':
      obj = new Door(data.x, data.y);
      break;
    case 'spawn':
      obj = new SpawnPoint(data.x, data.y);
      break;
    case 'coin':
      obj = new Coin(data.x, data.y, data.value || 100);
      if (data.collected) obj.collected = data.collected;
      break;
    case 'water':
      obj = new Water(data.x, data.y);
      break;
    case 'lava':
      obj = new Lava(data.x, data.y);
      break;
    case 'falling_block':
      obj = new FallingBlock(data.x, data.y);
      break;
    case 'key':
      obj = new Key(data.x, data.y, data.shape || 'circle');
      if (data.collected) obj.collected = data.collected;
      break;
    case 'locked_door':
      obj = new LockedDoor(data.x, data.y, data.shape || 'circle');
      if (data.locked !== undefined) obj.locked = data.locked;
      break;
    case 'enemy':
      obj = new Enemy(data.x, data.y);
      if (data.direction) obj.direction = data.direction;
      break;
    case 'character_gate':
      obj = new CharacterGate(data.x, data.y, data.requiredCharacter || 'cube');
      break;
    case 'switch_platform':
      obj = new SwitchPlatform(data.x, data.y);
      break;
    case 'double_jump':
      obj = new DoubleJumpOrb(data.x, data.y);
      break;
    case 'flamethrower':
      obj = new Flamethrower(data.x, data.y, data.intervalSeconds || Number(data.subtype) || 5);
      break;
    default:
      return null;
  }
  
  // Aplicar rotación si existe
  if (obj && data.rotation !== undefined) {
    obj.rotation = data.rotation;
  }
  
  return obj;
}
