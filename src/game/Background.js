/**
 * Sistema de fondos para el nivel
 * Diferentes temas visuales con diseños únicos
 */

export class Background {
  constructor(type = 'default') {
    this.type = type;
  }
  
  draw(p5, width, height, cameraX = 0, cameraY = 0) {
    switch (this.type) {
      case 'space':
        this.drawSpace(p5, width, height, cameraX, cameraY);
        break;
      case 'sunset':
        this.drawSunset(p5, width, height);
        break;
      case 'cave':
        this.drawCave(p5, width, height, cameraX, cameraY);
        break;
      case 'matrix':
        this.drawMatrix(p5, width, height, cameraX, cameraY);
        break;
      case 'night':
        this.drawNight(p5, width, height, cameraX, cameraY);
        break;
      default:
        this.drawDefault(p5, width, height);
    }
  }
  
  drawDefault(p5, width, height) {
    // Gradiente oscuro simple
    for (let y = 0; y < height; y++) {
      const inter = p5.map(y, 0, height, 0, 1);
      const c = p5.lerpColor(
        p5.color(15, 15, 30),
        p5.color(30, 30, 50),
        inter
      );
      p5.stroke(c);
      p5.line(0, y, width, y);
    }
    
    // Líneas decorativas
    p5.stroke(255, 255, 255, 20);
    p5.strokeWeight(1);
    for (let y = 0; y < height; y += 50) {
      p5.line(0, y, width, y);
    }
  }
  
  drawSpace(p5, width, height, cameraX, cameraY) {
    // Fondo negro espacial
    p5.background(5, 5, 15);
    
    // Estrellas estáticas (basadas en posición de cámara para parallax)
    p5.randomSeed(12345);
    for (let i = 0; i < 150; i++) {
      const x = p5.random(width + 400);
      const y = p5.random(height + 400);
      const size = p5.random(1, 3);
      const brightness = p5.random(150, 255);
      
      // Parallax effect
      const parallaxX = x - cameraX * 0.1;
      const parallaxY = y - cameraY * 0.1;
      
      p5.fill(brightness);
      p5.noStroke();
      p5.circle(parallaxX % (width + 400), parallaxY % (height + 400), size);
    }
    
    // Estrellas parpadeantes
    const twinkle = Math.sin(p5.frameCount * 0.05);
    p5.fill(255, 255, 255, 150 + twinkle * 100);
    p5.circle(100 - cameraX * 0.05, 100, 2);
    p5.circle(300 - cameraX * 0.05, 200, 1.5);
    p5.circle(500 - cameraX * 0.05, 150, 2.5);
    
    // Planeta lejano
    p5.fill(100, 100, 150, 100);
    p5.circle(width - 150 - cameraX * 0.03, 100, 80);
  }
  
  drawSunset(p5, width, height) {
    // Gradiente de atardecer
    for (let y = 0; y < height; y++) {
      const inter = p5.map(y, 0, height, 0, 1);
      let c;
      if (inter < 0.4) {
        c = p5.lerpColor(
          p5.color(255, 140, 60),  // Naranja
          p5.color(255, 90, 120),  // Rosa
          inter / 0.4
        );
      } else {
        c = p5.lerpColor(
          p5.color(255, 90, 120),   // Rosa
          p5.color(60, 40, 80),     // Púrpura oscuro
          (inter - 0.4) / 0.6
        );
      }
      p5.stroke(c);
      p5.line(0, y, width, y);
    }
    
    // Sol
    const sunY = height * 0.3;
    p5.fill(255, 200, 100, 200);
    p5.noStroke();
    p5.circle(width / 2, sunY, 120);
    p5.fill(255, 220, 120, 100);
    p5.circle(width / 2, sunY, 150);
    
    // Nubes silueta
    p5.fill(100, 50, 100, 100);
    p5.ellipse(width * 0.2, height * 0.6, 150, 40);
    p5.ellipse(width * 0.7, height * 0.5, 200, 50);
  }
  
  drawCave(p5, width, height, cameraX, cameraY) {
    // Fondo de cueva oscura
    p5.background(20, 15, 25);
    
    // Estalactitas (arriba)
    p5.fill(40, 35, 50);
    p5.noStroke();
    for (let i = 0; i < 8; i++) {
      const x = (i * 120 + 60 - cameraX * 0.2) % (width + 200);
      const h = 40 + (i % 3) * 20;
      p5.triangle(x - 15, 0, x, h, x + 15, 0);
    }
    
    // Estalagmitas (abajo)
    for (let i = 0; i < 7; i++) {
      const x = (i * 140 + 100 - cameraX * 0.2) % (width + 200);
      const h = 30 + (i % 4) * 15;
      p5.triangle(x - 12, height, x, height - h, x + 12, height);
    }
    
    // Cristales brillantes
    const glow = Math.sin(p5.frameCount * 0.03);
    p5.fill(100, 200, 255, 100 + glow * 50);
    p5.circle(150 - cameraX * 0.15, 200, 10);
    p5.circle(450 - cameraX * 0.15, 150, 8);
    p5.circle(650 - cameraX * 0.15, 250, 12);
  }
  
  drawMatrix(p5, width, height, cameraX, cameraY) {
    // Fondo estilo Matrix
    p5.background(0, 10, 0);
    
    // Código cayendo
    p5.fill(0, 255, 0, 30);
    p5.textSize(12);
    p5.textAlign(p5.CENTER);
    
    for (let x = 0; x < width; x += 20) {
      const offset = (p5.frameCount + x * 10) % (height + 100);
      const chars = '01';
      for (let y = offset - 100; y < offset; y += 20) {
        if (y > 0 && y < height) {
          const alpha = p5.map(y, offset - 100, offset, 0, 255);
          p5.fill(0, 255, 0, alpha * 0.5);
          p5.text(chars.charAt(Math.floor(p5.random(2))), x, y);
        }
      }
    }
    
    // Grid de fondo
    p5.stroke(0, 255, 0, 20);
    p5.strokeWeight(1);
    for (let x = 0; x < width; x += 40) {
      p5.line(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 40) {
      p5.line(0, y, width, y);
    }
  }
  
  drawNight(p5, width, height, cameraX, cameraY) {
    // Cielo nocturno
    for (let y = 0; y < height; y++) {
      const inter = p5.map(y, 0, height, 0, 1);
      const c = p5.lerpColor(
        p5.color(10, 10, 40),
        p5.color(5, 5, 20),
        inter
      );
      p5.stroke(c);
      p5.line(0, y, width, y);
    }
    
    // Luna
    p5.fill(240, 240, 255, 200);
    p5.noStroke();
    const moonX = width * 0.8 - cameraX * 0.05;
    const moonY = height * 0.2;
    p5.circle(moonX, moonY, 80);
    
    // Cráteres de la luna
    p5.fill(220, 220, 240, 150);
    p5.circle(moonX - 15, moonY - 10, 15);
    p5.circle(moonX + 10, moonY + 5, 20);
    p5.circle(moonX - 5, moonY + 15, 12);
    
    // Estrellas
    p5.randomSeed(54321);
    for (let i = 0; i < 100; i++) {
      const x = p5.random(width + 200);
      const y = p5.random(height * 0.7);
      const size = p5.random(1, 2);
      const twinkle = Math.sin(p5.frameCount * 0.05 + i) * 0.5 + 0.5;
      
      p5.fill(255, 255, 255, 150 + twinkle * 100);
      p5.circle((x - cameraX * 0.1) % (width + 200), y, size);
    }
    
    // Nubes oscuras
    p5.fill(20, 20, 40, 150);
    const cloudOffset = p5.frameCount * 0.5;
    p5.ellipse((200 + cloudOffset - cameraX * 0.3) % (width + 200), height * 0.7, 180, 50);
    p5.ellipse((500 + cloudOffset - cameraX * 0.3) % (width + 200), height * 0.65, 220, 60);
  }
  
  toJSON() {
    return {
      type: this.type
    };
  }
  
  static fromJSON(data) {
    return new Background(data.type || 'default');
  }
  
  static getAvailableTypes() {
    return [
      { id: 'default', name: 'Clásico', description: 'Fondo oscuro simple' },
      { id: 'space', name: 'Espacio', description: 'Estrellas y planetas' },
      { id: 'sunset', name: 'Atardecer', description: 'Gradiente cálido' },
      { id: 'cave', name: 'Cueva', description: 'Oscuridad con cristales' },
      { id: 'matrix', name: 'Matrix', description: 'Código digital' },
      { id: 'night', name: 'Noche', description: 'Cielo nocturno con luna' }
    ];
  }
}
