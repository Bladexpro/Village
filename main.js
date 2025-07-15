import { NPC } from "./classes/NPC.js";
import { Storage } from "./classes/Storage.js";
import { drawTile, generateRandomResource } from "./classes/utils.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TILE_SIZE = 64;
const GRID_WIDTH = Math.floor(canvas.width / TILE_SIZE);
const GRID_HEIGHT = Math.floor(canvas.height / TILE_SIZE);

let time = 0;

// === Global Game State ===
window.resources = [
  generateRandomResource("wood"),
  generateRandomResource("stone"),
  generateRandomResource("wood"),
  generateRandomResource("stone")
];

window.storages = [
  new Storage(1, 6, "wood", "#5c4b3b"),   // Lumberyard
  new Storage(6, 2, "stone", "#888888")  // Quarry
];
// Force draw a red square at tile (3, 3)
ctx.fillStyle = "red";
ctx.fillRect(3 * TILE_SIZE, 3 * TILE_SIZE, TILE_SIZE, TILE_SIZE);

const npcs = [
  new NPC("wood", 2, 1),   // Lumberjack
  new NPC("stone", 4, 4)   // Miner
];

function update() {
  npcs.forEach(npc => npc.update(window.resources));
  time += 0.01;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const brightness = Math.floor(100 + 100 * Math.sin(time));
  document.body.style.background = `rgb(${brightness}, ${brightness}, ${brightness})`;

  // Ground
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      drawTile(ctx, x, y, "#6c9a3f");
    }
  }

  // Resources
  window.resources.forEach(res => res.draw());

  // Storages
  window.storages.forEach(s => s.draw());

  // NPCs
  npcs.forEach(npc => npc.draw());
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
