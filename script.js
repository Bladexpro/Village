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

// === World ===
let tree = randomTree();
let storage = { x: 1, y: 6, stored: 0 };

//CLASSES
class Resource {
  constructor(x, y, type, color) {
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


class NPC {
  constructor(type, x, y) {
    this.type = type;
    this.x = (typeof x === "number") ? x : Math.floor(Math.random() * gridWidth);
    this.y = (typeof y === "number") ? y : Math.floor(Math.random() * gridHeight);
    
    this.state = "walking";
    this.inventory = 0;
    this.target = findNearestResource(this);
    this.workTimer = 0;
  }
  moveToward(target, speed) {
    if (!target) return;
    if (this.x < target.x) this.x += speed;
    else if (this.x > target.x) this.x -= speed;
    if (this.y < target.y) this.y += speed;
    else if (this.y > target.y) this.y -= speed;
  }
}

// === Time ===
let time = 0;

// === Functions ===
function randomTree() {
  return {
    x: Math.floor(Math.random() * GRID_WIDTH),
    y: Math.floor(Math.random() * GRID_HEIGHT),
    chopped: false
  };
}

function update() {
  if (npc.state === "walking") {
    moveToward(npc, npc.target);

    if (reached(npc, tree) && !tree.chopped && npc.inventory === 0) {
      npc.state = "chopping";
      drawText("🪓",     npc.x * TILE_SIZE + TILE_SIZE / 4,
    npc.y * TILE_SIZE - 8);
      npc.choppingTimer = 2; // seconds
    }

    if (reached(npc, storage) && npc.inventory === 1) {
      npc.state = "storing";
    }

  } else if (npc.state === "chopping") {
    npc.choppingTimer -= 1 / 60; // approx. 60 FPS

    if (npc.choppingTimer <= 0) {
      tree.chopped = true;
      npc.inventory = 1;
      npc.state = "carrying";
      npc.target = { x: storage.x, y: storage.y };
    }

  } else if (npc.state === "carrying") {
    npc.state = "walking";

  } else if (npc.state === "storing") {
    npc.inventory = 0;
    storage.stored += 1;

    // Spawn a new tree
    tree = randomTree();
    npc.target = { x: tree.x, y: tree.y };
    npc.state = "walking";
  }

  time += 0.01;
}


function moveToward(entity, target) {
  const speed = 0.02;//const speed = 0.02;
  if (entity.x < target.x) entity.x += speed;
  else if (entity.x > target.x) entity.x -= speed;
  if (entity.y < target.y) entity.y += speed;
  else if (entity.y > target.y) entity.y -= speed;
}

function reached(a, b) {
  return Math.abs(a.x - b.x) < 0.05 && Math.abs(a.y - b.y) < 0.05;
}

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawText(text, x, y) {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(text, x, y);
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

  if (!tree.chopped) drawTile(tree.x, tree.y, colors.tree);

  drawTile(storage.x, storage.y, colors.storage);
  drawText("Logs: " + storage.stored, storage.x * TILE_SIZE, storage.y * TILE_SIZE - 10);

  drawTile(npc.x, npc.y, colors.npc);
  if (npc.inventory > 0) {
    drawText("🪵", npc.x * TILE_SIZE + 16, npc.y * TILE_SIZE + 40);
  }
}

//SETUP+LOOP

const resources = [];
resources.push(new Resource(1, 2, "wood", "#3b5e2b"));
resources.push(new Resource(4, 5, "stone", "#888888"));
resources.push(new Resource(6, 3, "strawberry", "#f4071bff"));

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
