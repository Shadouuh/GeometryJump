import { useEffect, useRef } from 'react';
import p5 from 'p5';
import { animateFloat } from '../../../utils/characterDrawer';
import './CharacterPreview.css';

// CharacterPreview (p5)
// - Es un dibujo del personaje para el menu
// - No es el juego, no hay choques
// - p5 corre setup() una vez y draw() en loop

export const CharacterPreview = ({ character }) => {
  const canvasRef = useRef(null); // div donde p5 mete el canvas
  const p5Instance = useRef(null); // instancia viva de p5

  useEffect(() => {
    // Si cambia el personaje, reiniciamos el dibujo
    const sketch = (p) => {
      let time = 0;
      const SIZE = 280;
      const CENTER = SIZE / 2;

      p.setup = () => {
        // p5: una vez
        p.createCanvas(SIZE, SIZE); // crear canvas
        p.frameRate(60); // fps
      };

      p.draw = () => {
        // p5: en loop
        p.background(10, 10, 30); // fondo
        
        // circulos de fondo
        p.noStroke();
        for (let i = 0; i < 3; i++) {
          p.fill(139, 92, 246, 5 + i * 5);
          p.circle(CENTER, CENTER, 240 - i * 70);
        }

        // personaje al centro
        p.push();
        p.translate(CENTER, CENTER);
        
        // helper que dibuja y le da un "flotado"
        animateFloat(p, character, 0, 0, 84, time);
        
        p.pop();

        time += 1; // avanza el reloj
      };
    };

    if (canvasRef.current) {
      // si ya habia un p5, lo borramos
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
      
      // crear p5 nuevo
      p5Instance.current = new p5(sketch, canvasRef.current);
    }

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove(); // limpieza
      }
    };
  }, [character]);

  return (
    <div className="character-preview">
      <div ref={canvasRef} className="preview-canvas"></div>
    </div>
  );
};
