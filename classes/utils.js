import { Resource } from "./Resource.js";

export function drawTile(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * 64, y * 64, 64, 64); // assuming TILE_SIZE = 64
}



export function drawText(text, x, y) {
  const ctx = document.getElementById('gameCanvas').getContext('2d');
  ctx.fillStyle = "white";
  ctx.font = "20px 'Segoe UI Emoji'";
  ctx.fillText(text, x, y);
}

export function reached(a, b) {
  return Math.abs(a.x - b.x) < 0.05 && Math.abs(a.y - b.y) < 0.05;
}

export function generateRandomResource(type = "wood") {
  const width = Math.floor(window.innerWidth / 64);
  const height = Math.floor(window.innerHeight / 64);

  const colors = {
    wood: "#3b5e2b",
    stone: "#888888",
    berry: "#a22"
  };

  return new Resource(
    Math.floor(Math.random() * width),
    Math.floor(Math.random() * height),
    type,
    colors[type] || "#fff"
  );
}

export function findNearestResource(npc, resources = window.resources || []) {
  return resources.find(r => r.alive && r.type === npc.type);
}

export function findStorageFor(npc, storages = window.storages || []) {
  return storages.find(s => s.type === npc.type);
}

export function randomIdleTarget() {
  const width = Math.floor(window.innerWidth / 64);
  const height = Math.floor(window.innerHeight / 64);
  return {
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height)
  };
}
