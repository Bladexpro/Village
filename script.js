const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TILE_SIZE = 64;
const GRID_WIDTH = Math.floor(canvas.width / TILE_SIZE);
const GRID_HEIGHT = Math.floor(canvas.height / TILE_SIZE);

const colors = {
  ground: "#6c9a3f",
  tree: "#3b5e2b",
  storage: "#5c4b3b",
  npc: "#d9a066"
};

function randomCoords() {
  return {
    x: Math.floor(Math.random() * GRID_WIDTH),
    y: Math.floor(Math.random() * GRID_HEIGHT)
  };
}

class Resource {
  constructor(type = "wood") {
    const {x, y} = randomCoords();
    this.x = x;
    this.y = y;
    this.type = type;
    this.chopped = false;
  }

  draw() {
    if (!this.chopped) {
      drawTile(this.x, this.y, colors.tree);
    }
  }
}

class Storage {
  constructor() {
    const {x, y} = randomCoords();
    this.x = x;
    this.y = y;
    this.stored = 0;
  }

  draw() {
    drawTile(this.x, this.y, colors.storage);
    drawText(`Logs: ${this.stored}`, this.x * TILE_SIZE, this.y * TILE_SIZE - 10);
  }
}

class NPC {
  constructor(storage, resources) {
    // Start NPC near storage
    this.x = storage.x;
    this.y = storage.y;
    this.state = "walking";
    this.inventory = 0;
    this.choppingTimer = 0;
    this.storage = storage;
    this.resources = resources;
    this.target = this.findNearestResource();
  }

  findNearestResource() {
    // Just return first unchopped resource for now
    return this.resources.find(r => !r.chopped);
  }

  moveToward(target) {
    const speed = 0.02;
    if (this.x < target.x) this.x += speed;
    else if (this.x > target.x) this.x -= speed;
    if (this.y < target.y) this.y += speed;
    else if (this.y > target.y) this.y -= speed;
  }

  reached(target) {
    return Math.abs(this.x - target.x) < 0.05 && Math.abs(this.y - target.y) < 0.05;
  }

  update() {
    switch(this.state) {
      case "walking":
        if (!this.target) {
          this.target = this.findNearestResource();
          if (!this.target) {
            // No resource left, do nothing
            return;
          }
        }

        this.moveToward(this.target);

        if (this.target instanceof Resource && !this.target.chopped && this.inventory === 0 && this.reached(this.target)) {
          this.state = "chopping";
          this.choppingTimer = 2; // seconds
        } else if (this.target === this.storage && this.inventory === 1 && this.reached(this.storage)) {
          this.state = "storing";
        }
        break;

      case "chopping":
        this.choppingTimer -= 1 / 60;
        if (this.choppingTimer <= 0) {
          this.target.chopped = true;
          this.inventory = 1;
          this.target = this.storage;
          this.state = "walking";
        }
        break;

      case "storing":
        this.inventory = 0;
        this.storage.stored += 1;
        this.target = this.findNearestResource();
        this.state = "walking";
        break;
    }
  }

  draw() {
    drawTile(Math.floor(this.x), Math.floor(this.y), colors.npc);
    if (this.inventory > 0) {
      drawText("🪵", Math.floor(this.x) * TILE_SIZE + 16, Math.floor(this.y) * TILE_SIZE + 40);
    }
    if (this.state === "chopping") {
      drawText("🪓", Math.floor(this.x) * TILE_SIZE + TILE_SIZE / 4, Math.floor(this.y) * TILE_SIZE - 8);
    }
  }
}

// Drawing helpers
function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawText(text, x, y) {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(text, x, y);
}

// Setup
const resources = [new Resource()];
const storage = new Storage();
const npc = new NPC(storage, resources);

let time = 0;

function update() {
  npc.update();
  time += 0.01;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const brightness = Math.floor(100 + 100 * Math.sin(time));
  document.body.style.background = `rgb(${brightness}, ${brightness}, ${brightness})`;

  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      drawTile(x, y, colors.ground);
    }
  }

  resources.forEach(r => r.draw());
  storage.draw();
  npc.draw();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
