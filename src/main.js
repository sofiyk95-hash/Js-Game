import { CONFIG } from './config.js';
import { Player, Alien, Laser } from './entities.js';
import { GameView } from './view.js';

class Game {
  constructor() {
    this.view = new GameView();
    this.player = null;
    this.aliens = [];
    this.lasers = [];
    this.score = 0;
    this.currentMultiplier = CONFIG.INITIAL_SPEED_MULTIPLIER;
    this.currentIntervalMs = null;
    this.nextSpeedUpScore = 2000;
    this.isGameActive = false;
    this.gameInterval = null;
    this.startBtn = document.getElementById('start-btn');
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.startGame());
    }
    window.addEventListener('keydown', (event) => this.handleInput(event));
  }
  generateAliens() {
    const aliensList = [];
    for (let row = 0; row < 4; row++) {
      const startX = row;
      const endX = CONFIG.GRID_WIDTH - 1 - row;
      const colors = ['red', 'orange', 'yellow', 'blue'];
      const color = colors[row] || 'red';

      for (let x = startX; x <= endX; x++) {
        aliensList.push(new Alien(x, row, color));
      }
    }
    return aliensList;
  }

  startGame() {
    if (this.startBtn) {
      this.startBtn.blur();
    }
    const speedSelect = document.getElementById('speed-select');
    this.currentIntervalMs = speedSelect
      ? Number(speedSelect.value)
      : CONFIG.INITIAL_SPEED_MULTIPLIER;
    this.currentMultiplier = speedSelect ? speedSelect.options[speedSelect.selectedIndex].text : "05";
    this.score = 0;
    this.isGameActive = true;
    this.tick = 0;
    this.nextSpeedUpScore = 2000;
    if (this.gameInterval) clearInterval(this.gameInterval);

    this.player = new Player();
    this.aliens = this.generateAliens();
    this.lasers = [];

    this.updateScreen();
    this.gameInterval = setInterval(
      () => this.gameLoop(),
      this.currentIntervalMs,
    );
  }

  gameLoop() {
    if (!this.isGameActive) return;
    this.tick++;
    const shouldAliensMove = this.tick % 3 === 0;
    const oldAlienPositions = shouldAliensMove
      ? new Map(this.aliens.filter((a) => a.isAlive).map((a) => [a, a.y]))
      : new Map();
    if (shouldAliensMove) {
      this.aliens.forEach((alien) => {
        if (alien.isAlive) {
          alien.moveDown();
        }
      });
    }

    this.lasers.forEach((laser) => {
      if (laser.isAlive) laser.moveUp();
    });

    this.lasers.forEach((laser) => {
      if (!laser.isAlive) return;

      this.aliens.forEach((alien) => {
        if (!alien.isAlive) return;

        const oldY = shouldAliensMove ? oldAlienPositions.get(alien) : alien.y;
        const directHit = laser.x === alien.x && laser.y === alien.y;
        const passedEachOther =
          laser.x === alien.x && oldY === laser.y && alien.y === laser.y + 1;

        if (directHit || passedEachOther) {
          alien.isAlive = false;
          laser.isAlive = false;
          this.score += CONFIG.POINTS_PER_ALIEN;
        }
      });
    });
    this.lasers = this.lasers.filter((laser) => laser.isAlive && laser.y >= 0);
    this.checkGameStatus();
    this.checkSpeedUp();
    this.updateScreen();
  }

  checkGameStatus() {
    const reachedBottom = this.aliens.some(
      (alien) => alien.isAlive && alien.y >= CONFIG.GRID_HEIGHT - 1,
    );

    if (reachedBottom) {
      this.endGame(false);
      return;
    }

    const allDead = this.aliens.every((alien) => !alien.isAlive);
    if (allDead && this.aliens.length > 0) {
      this.aliens = this.generateAliens();
    }
  }
  checkSpeedUp() {
    // Якщо рахунок доріс до нашої планки (5000, 10000 тощо)
    if (this.score >= this.nextSpeedUpScore) {
      this.nextSpeedUpScore += 2000; // Збільшуємо планку на майбутнє

      // Прискорюємо гру на 15%, але не дозволяємо таймеру стати меншим за 20мс
      this.currentIntervalMs = Math.max(20, this.currentIntervalMs * 0.85);

      // Перезапускаємо таймер з новою швидкістю
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(
        () => this.gameLoop(),
        this.currentIntervalMs,
      );

      console.log(
        `🚀 ШВИДКІСТЬ ЗБІЛЬШЕНО! Новий інтервал: ${this.currentIntervalMs.toFixed(2)}мс`,
      );
    }
  }

  endGame() {
    this.isGameActive = false;
    if (this.gameInterval) clearInterval(this.gameInterval);

    setTimeout(() => {
      alert(`💥 GAME OVER! Прибульці захопили базу. Рахунок: ${this.score}`);
      this.aliens = [];
      this.lasers = [];
      this.updateScreen();
    }, 50); // ◄ Твоє число 50 залишається на місці!
  }

  handleInput(event) {
    if (!this.isGameActive || !this.player) return;

    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.player.moveLeft();
        this.updateScreen();
        break;

      case 'ArrowRight':
      case 'KeyD':
        this.player.moveRight();
        this.updateScreen();
        break;

      case 'Space':
        event.preventDefault();
        this.lasers.push(new Laser(this.player.x, this.player.y - 1));
        this.updateScreen();
        break;
    }
  }

  updateScreen() {
    this.view.render(
      this.player,
      this.aliens,
      this.score,
      this.currentMultiplier,
      this.lasers,
    );
  }
}

new Game();