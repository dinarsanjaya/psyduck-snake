#!/usr/bin/env node
const keypress = require('keypress');

class SnakeGame {
  constructor() {
    this.score = 0;
    this.direction = 'RIGHT';
    this.snake = [{ x: 10, y: 10 }];
    this.food = this.generateFood();
  }

  generateFood() {
    return {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20)
    };
  }

  update() {
    const head = { ...this.snake[0] };
    if (this.direction === 'UP') head.y--;
    if (this.direction === 'DOWN') head.y++;
    if (this.direction === 'LEFT') head.x--;
    if (this.direction === 'RIGHT') head.x++;

    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || 
        this.snake.some(s => s.x === head.x && s.y === head.y)) {
      console.log('Game Over! Score:', this.score);
      process.exit();
    }

    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.food = this.generateFood();
    } else {
      this.snake.pop();
    }
  }

  draw() {
    console.clear();
    let board = `Score: ${this.score}\n(WASD to move, Ctrl+C to exit)\n`;
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        if (this.snake.some(s => s.x === x && s.y === y)) board += '■';
        else if (x === this.food.x && y === this.food.y) board += '★';
        else board += '·';
      }
      board += '\n';
    }
    console.log(board);
  }
}

const game = new SnakeGame();
keypress(process.stdin);

process.stdin.on('keypress', (ch, key) => {
  if (key?.name === 'w') game.direction = 'UP';
  if (key?.name === 's') game.direction = 'DOWN';
  if (key?.name === 'a') game.direction = 'LEFT';
  if (key?.name === 'd') game.direction = 'RIGHT';
  if (key?.ctrl && key?.name === 'c') process.exit();
});

process.stdin.setRawMode(true);
process.stdin.resume();

setInterval(() => {
  game.update();
  game.draw();
}, 200);