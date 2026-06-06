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
    const speedSelect = document.getElementById('speedSelect');
    this.currentMultiplier = speedSelect
      ? Number(speedSelect.value)
      : CONFIG.INITIAL_SPEED_MULTIPLIER;
    const calculatedInterval = CONFIG.BASE_INTERVAL * this.currentMultiplier;

    this.score = 0;
    this.isGameActive = true;

    if (this.gameInterval) clearInterval(this.gameInterval);

    this.player = new Player();
    this.aliens = this.generateAliens();
    this.lasers = [];

    this.updateScreen();
    this.gameInterval = setInterval(() => this.gameLoop(), calculatedInterval);
  }

  gameLoop() {
    if (!this.isGameActive) return;

    const oldAlienPositions = new Map(
      this.aliens.filter((a) => a.isAlive).map((a) => [a, a.y]),
    );

    this.aliens.forEach((alien) => {
      if (alien.isAlive) {
        alien.moveDown();
      }
    });

    this.lasers.forEach((laser) => {
      if (laser.isAlive) laser.moveUp();
    });

    this.lasers.forEach((laser) => {
      if (!laser.isAlive) return;

      this.aliens.forEach((alien) => {
        if (!alien.isAlive) return;

        const oldY = oldAlienPositions.get(alien);
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
      this.endGame(true);
    }
  }

  endGame(isWin) {
    this.isGameActive = false;
    if (this.gameInterval) clearInterval(this.gameInterval);

    setTimeout(() => {
      if (isWin) {
        alert(`🏆 ПЕРЕМОГА! Всесвіт у безпеці! Рахунок: ${this.score}`);
      } else {
        alert(`💥 GAME OVER! Прибульці захопили базу. Рахунок: ${this.score}`);
      }
    }, 50);
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

const game = new Game();