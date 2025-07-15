import { drawTile } from './utils.js';

export class Resource {
  constructor(x, y, type = "wood", color = "#3b5e2b") {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.alive = true;
  }

  draw() {
    if (this.alive) {
      drawTile(this.x, this.y, this.color);
    }
  }
}
