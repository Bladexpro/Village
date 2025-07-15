import { drawTile, drawText } from './utils.js';

export class Storage {
  constructor(x, y, type = "wood", color = "#5c4b3b") {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.stored = 0;
  }

  draw() {
    drawTile(this.x, this.y, this.color);
    drawText(`${this.type}: ${this.stored}`, this.x * 64, this.y * 64 - 10);
  }
}
