// Utilidad para dibujar personajes con P5.js
export const drawCharacter = (p5, character, x, y, size = 60, withFace = true) => {
  p5.push();
  p5.translate(x, y);
  
  // Color del personaje
  p5.fill(character.color);
  p5.stroke(255);
  p5.strokeWeight(3);
  
  // Dibujar forma según el tipo
  switch (character.type) {
    case 'square':
      p5.rectMode(p5.CENTER);
      p5.rect(0, 0, size, size);
      break;
      
    case 'rhombus':
      p5.quad(
        0, -size / 2,
        size / 2, 0,
        0, size / 2,
        -size / 2, 0
      );
      break;
      
    case 'triangle':
      p5.triangle(
        0, -size / 2,
        -size / 2, size / 2,
        size / 2, size / 2
      );
      break;
      
    case 'circle':
      p5.circle(0, 0, size);
      break;
      
    case 'isosceles':
      p5.triangle(
        0, -size / 1.5,
        -size / 3, size / 2,
        size / 3, size / 2
      );
      break;
      
    case 'rectangle':
      p5.rectMode(p5.CENTER);
      p5.rect(0, 0, size * 0.6, size * 1.2);
      break;
      
    default:
      p5.circle(0, 0, size);
  }
  
  // Dibujar cara si está habilitado
  if (withFace) {
    drawFace(p5, character.type, size);
  }
  
  p5.pop();
};

const drawFace = (p5, type, size) => {
  p5.fill(255);
  p5.noStroke();
  
  const eyeSize = size * 0.15;
  const mouthWidth = size * 0.4;
  
  // Posición de ojos según el tipo
  let leftEyeX = -size * 0.2;
  let rightEyeX = size * 0.2;
  let eyeY = -size * 0.1;
  let mouthY = size * 0.15;
  
  if (type === 'triangle' || type === 'isosceles') {
    eyeY = -size * 0.15;
    mouthY = size * 0.1;
  }
  
  if (type === 'rhombus') {
    eyeY = -size * 0.12;
    mouthY = size * 0.12;
  }
  
  // Ojos
  p5.circle(leftEyeX, eyeY, eyeSize);
  p5.circle(rightEyeX, eyeY, eyeSize);
  
  // Pupilas
  p5.fill(0);
  p5.circle(leftEyeX, eyeY, eyeSize * 0.5);
  p5.circle(rightEyeX, eyeY, eyeSize * 0.5);
  
  // Sonrisa
  p5.noFill();
  p5.stroke(255);
  p5.strokeWeight(2);
  p5.arc(0, mouthY, mouthWidth, mouthWidth * 0.6, 0, p5.PI);
};

// Animación de salto
export const animateJump = (p5, character, x, y, size, time) => {
  const jumpHeight = Math.sin(time * 0.1) * 20;
  drawCharacter(p5, character, x, y - Math.abs(jumpHeight), size);
};

// Animación de flotación
export const animateFloat = (p5, character, x, y, size, time) => {
  const floatOffset = Math.sin(time * 0.05) * 10;
  drawCharacter(p5, character, x, y + floatOffset, size);
};
