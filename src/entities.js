import { CONFIG } from './config.js';

class GameEntity {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = CONFIG.CELL_SIZE;
    this.height = CONFIG.CELL_SIZE;
  }
}
export class Player extends GameEntity {
  constructor() {
    const startX = Math.floor(CONFIG.GRID_WIDTH / 2) - 1;
    const startY = CONFIG.GRID_HEIGHT - 1;
    super(startX, startY, 'purple');
  }
  moveLeft() {
    if (this.x > 0) {
      this.x--;
    }
  }

  moveRight() {
    if (this.x < CONFIG.GRID_WIDTH - 1) {
      this.x++;
    }
  }
}
export class Alien extends GameEntity {
  constructor(x, y, color) {
    super(x, y, color);
    this.width = CONFIG.ALIEN_VISUAL_SIZE;
    this.height = CONFIG.ALIEN_VISUAL_SIZE;
    this.isAlive = true;
  }

  moveDown() {
    this.y++;
  }
}
export class Laser extends GameEntity {
  constructor(x, y) {
    super(x, y, 'red');
    this.width = CONFIG.LASER_WIDTH;
    this.height = CONFIG.LASER_HEIGHT;
    this.isAlive = true;
  }
  moveUp() {
    this.y--;
  }
}
