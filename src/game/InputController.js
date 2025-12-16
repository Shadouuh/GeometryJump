/**
 * InputController
 *
 * Esta clase solo lee teclas desde p5 y devuelve "true/false"
 * La idea es que GameEngine no tenga que repetir codigo de teclas
 *
 * Nota: el salto usa "solo este frame" para que SPACE no dispare
 * salto infinito mientras mantenes apretado
 */

export class InputController {
  constructor(p5Instance) {
    this.p5 = p5Instance;
    
    // Memoria para saber si el salto recien se apreto
    this.jumpPressed = false;
    this.jumpWasPressed = false;
    
    // Codigos de teclas
    this.KEYS = {
      LEFT: this.p5.LEFT_ARROW,
      RIGHT: this.p5.RIGHT_ARROW,
      UP: this.p5.UP_ARROW,
      SPACE: 32,
      W: 87,
      A: 65,
      D: 68,
      R: 82,
      ESC: 27
    };
  }
  
  /**
   * Izquierda apretada?
   * Sirve con: ← o A
   */
  isLeftPressed() {
    const leftArrow = this.p5.keyIsDown(this.KEYS.LEFT);
    const aKey = this.p5.keyIsDown(this.KEYS.A);
    return leftArrow || aKey;
  }
  
  /**
   * Derecha apretada?
   * Sirve con: → o D
   */
  isRightPressed() {
    const rightArrow = this.p5.keyIsDown(this.KEYS.RIGHT);
    const dKey = this.p5.keyIsDown(this.KEYS.D);
    return rightArrow || dKey;
  }
  
  /**
   * Salto apretado?
   * Sirve con: SPACE, ↑ o W
   */
  isJumpPressed() {
    const space = this.p5.keyIsDown(this.KEYS.SPACE);
    const upArrow = this.p5.keyIsDown(this.KEYS.UP);
    const wKey = this.p5.keyIsDown(this.KEYS.W);
    return space || upArrow || wKey;
  }
  
  /**
   * Salto recien apretado?
   * Solo devuelve true una vez, justo cuando apretas la tecla
   */
  isJumpJustPressed() {
    // Estado actual
    this.jumpPressed = this.isJumpPressed();
    
    // True solo cuando pasa de: no -> si
    const justPressed = this.jumpPressed && !this.jumpWasPressed;
    
    // Guardamos para el siguiente frame
    this.jumpWasPressed = this.jumpPressed;
    
    return justPressed;
  }
  
  /**
   * Convierte teclas en velocidad horizontal
   * Devuelve: -moveSpeed, 0, +moveSpeed
   */
  getHorizontalInput(moveSpeed) {
    const left = this.isLeftPressed();
    const right = this.isRightPressed();
    
    // Si apretas las dos, se cancelan
    if (left && right) {
      return 0;
    }
    
    // Izquierda
    if (left) {
      return -moveSpeed;
    }
    
    // Derecha
    if (right) {
      return moveSpeed;
    }
    
    // Nada
    return 0;
  }
  
  /**
   * Reset del controller
   * Se usa cuando reinicias el nivel
   */
  reset() {
    this.jumpPressed = false;
    this.jumpWasPressed = false;
  }
}
