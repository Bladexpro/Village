import {
  drawTile,
  drawText,
  reached,
  findNearestResource,
  findStorageFor,
  randomIdleTarget,
  generateRandomResource
} from './utils.js';

export class NPC {
  constructor(type = "wood", x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.state = "walking";
    this.inventory = 0;
    this.target = findNearestResource(this);
    this.workTimer = 0;
  }

  update(resources) {
    if (this.state === "walking") {
      this.moveToward(this.target, 0.02);

      if (this.target && this.target.alive && reached(this, this.target) && this.inventory === 0) {
        this.state = "working";
        this.workTimer = 2;
      }

      const targetStorage = findStorageFor(this);
      if (this.target === targetStorage && reached(this, this.target) && this.inventory === 1) {
        this.state = "storing";
      }

    } else if (this.state === "working") {
      this.workTimer -= 1 / 60;
      if (this.workTimer <= 0) {
        this.target.alive = false;
        this.inventory = 1;
        this.target = findStorageFor(this);
        this.state = "carrying";
      }

    } else if (this.state === "carrying") {
      this.state = "walking";

    } else if (this.state === "storing") {
      this.inventory = 0;

      const store = findStorageFor(this);
      if (store) store.stored += 1;

      resources.push(generateRandomResource(this.type));
      this.target = findNearestResource(this);
      this.state = this.target ? "walking" : "idle";

    } else if (this.state === "idle") {
      this.moveToward(this.target, 0.01);
      if (reached(this, this.target)) {
        this.target = randomIdleTarget();
      }

      const nearest = findNearestResource(this);
      if (nearest) {
        this.target = nearest;
        this.state = "walking";
      }
    }
  }

  moveToward(target, speed) {
    if (!target) return;
    if (this.x < target.x) this.x += speed;
    else if (this.x > target.x) this.x -= speed;
    if (this.y < target.y) this.y += speed;
    else if (this.y > target.y) this.y -= speed;
  }

  draw() {
    drawTile(this.x, this.y, "#d9a066");
    if (this.inventory > 0) {
      drawText("🔨", this.x * 64 + 16, this.y * 64 + 40);
    }
  }
}
