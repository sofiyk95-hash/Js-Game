import { CONFIG } from './config.js';
export class GameView {
  constructor() {
    this.board = document.getElementById('game-board');
    this.scoreElement = document.getElementById('score-value');
    this.speedElement = document.getElementById('speed-value');
  }
  clearBoard() {
    this.board.innerHTML = '';
  }
  renderEntity(entity, className) {
    const div = document.createElement('div');
    div.classList.add(className);
    div.style.position = 'absolute';
    div.style.width = `${entity.width}px`;
    div.style.height = `${entity.height}px`;
    div.style.backgroundColor = entity.color;
    div.style.left = `${entity.x * CONFIG.CELL_SIZE}px`;
    div.style.top = `${entity.y * CONFIG.CELL_SIZE}px`;
    this.board.appendChild(div);
  }
  render(player, aliens, score, currentMultiplier,lasers = []) {
    this.clearBoard();
    this.renderEntity(player, 'player-unit');
    aliens.forEach(alien => {
      if (alien.isAlive) {
        this.renderEntity(alien, 'alien-unit');
      }
    });
    lasers.forEach(laser => {
      if (laser.isAlive) {
        this.renderEntity(laser, 'laser-unit');
      }
    });
    if (this.scoreElement) this.scoreElement.textContent = score;
    if (this.speedElement) this.speedElement.textContent = String(currentMultiplier).padStart(2, '0');
  }

}