class NPC {
  constructor(resources) {
    const {x, y} = randomCoords();
    this.x = x;
    this.y = y;
    this.state = "walking";
    this.inventory = 0;
    this.workingTime = 2; //in seconds or miliseconds
    this.type = type;
  }

  moveToward(target) {
    const speed = 0.02;
    if (this.x < target.x) this.x = Math.min(this.x + speed, target.x);
    else if (this.x > target.x) this.x = Math.max(this.x - speed, target.x);
    if (this.y < target.y) this.y = Math.min(this.y + speed, target.y);
    else if (this.y > target.y) this.y = Math.max(this.y - speed, target.y);
  }

  reached(target) {
    return Math.abs(this.x - target.x) < 0.05 && Math.abs(this.y - target.y) < 0.05;
  }

  setTargetResource() {
    const target = this.resources.find(r => r.alive && !r.targeted);
    if (target) {
      this.target = target;
      target.targeted = true;
      this.state = "walking";
    } else {
      this.target = null;
      this.state = "idle";
    }
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

        if (this.target instanceof Resource && this.target.alive && this.inventory === 0 && this.reached(this.target)) {
          this.state = "chopping";
          this.choppingTimer = 2; // seconds
        } else if (this.target === this.storage && this.inventory === 1 && this.reached(this.storage)) {
          this.state = "storing";
        }
        break;

      case "chopping":
        this.choppingTimer -= 1 / 60;
        if (this.choppingTimer <= 0) {
          this.target.alive = false;
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
const storage = [new Storage()];
const npc = [new NPC()];

let time = 0;

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

function update() {
  npc.update();
  time += 0.01;
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
