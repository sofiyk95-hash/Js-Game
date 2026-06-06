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

    // Навешиваем класс и базовые стили абсолютного позиционирования
    div.classList.add(className);
    div.style.position = 'absolute';
    div.style.width = `${entity.width}px`;
    div.style.height = `${entity.height}px`;
    div.style.backgroundColor = entity.color;

    // Переводим игровые координаты (0, 1, 2...) в пиксели CSS по нашей формуле
    div.style.left = `${entity.x * CONFIG.CELL_SIZE}px`;
    div.style.top = `${entity.y * CONFIG.CELL_SIZE}px`;

    // Добавляем созданный div внутрь сетки #game-board
    this.board.appendChild(div);
  }

  // Главный динамический метод, который будет вызываться игровым циклом
  render(player, aliens, score, currentMultiplier,lasers = []) {
    // 1. Стираем всё старое
    this.clearBoard();

    // 2. Рисуем игрока
    this.renderEntity(player, 'player-unit');

    // 3. Пробегаемся по массиву пришельцев и рисуем только живых
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

    // 4. Обновляем циферки на панели UI
    if (this.scoreElement) this.scoreElement.textContent = score;
    if (this.speedElement) this.speedElement.textContent = String(currentMultiplier).padStart(2, '0');
  }

}