const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dimensions = {
    width: canvas.width,
    height: canvas.height,
    speed: 10,
    resource: 45,
    house: 150,
    storage: 70,
    npc: 80
}

const colors = {
    ground: "#6c9a3f",
    tree: "#3b5e2b",
    storage: "#5c4b3b",
    npc: "#d9a066",
    house: "#8b4513"
};

function randomCoords() {
  return {
    x: Math.random() * dimensions.width,
    y: Math.random() * dimensions.height
  };
}

function drawSquare(x, y, size, color) {
  //Base form
  context.fillStyle = color;
  context.fillRect(x, y, size, size);
  //Outline
  context.strokeStyle = "#00000044";
  context.strokeRect(x, y, size, size);
}

function drawText(x, y, text) {
  context.fillStyle = "white";
  context.font = "16px Arial";
  context.fillText(text, x, y);
}

class Resource {
  constructor(type = "wood") {
    const {x, y} = randomCoords();
    this.x = x;
    this.y = y;
    this.type = type;
    this.alive = true;
    this.targeted = false;
  }

  draw() {
    if (this.alive) {
      drawSquare(this.x, this.y, dimensions.resource, colors.tree);
    }
  }
}

class Storage {
  constructor(type = "wood") {
    const {x, y} = randomCoords();
    this.x = x;
    this.y = y;
    this.type = type;
    this.stored = 0;
  }

  draw() {
    drawSquare(this.x, this.y, dimensions.storage, colors.storage);
    drawText(this.x, this.y - 10,`Logs: ${this.stored}`);
  }
}

class House {
  constructor(type = "wood") {
    const {x, y} = randomCoords();
    this.x = x;
    this.y = y;
    this.type = type;
  }

  draw() {
    drawSquare(this.x, this.y, dimensions.house, colors.storage);
    drawText(this.x + 5, this.y + dimensions.house / 2, "House");

  }
}

class Npc {
  constructor(type = "wood", name) {
    const {x, y} = randomCoords();
    this.x = x;
    this.y = y;
    this.state = "walking";
    this.inventory = 0;
    this.workingTime = 2; //in seconds or miliseconds
    this.type = type;
    this.name = name;
  }

  draw() {  
    context.drawImage(man, this.x, this.y, dimensions.npc, dimensions.npc)
    drawText(this.x, this.y - 10, this.name);
  }

    moveTo(x,y){
        if (this.x < x) 
            this.x = Math.min(this.x + dimensions.speed, x);
        else if (this.x > x) 
            this.x = Math.max(this.x - dimensions.speed, x);
        if (this.y < y)
            this.y = Math.min(this.y + dimensions.speed, y);
        else if (this.y > y)
            this.y = Math.max(this.y - dimensions.speed, y);
    }
}

const man = new Image();

const resources = [//Resource("type","name")
  new Resource("wood","tree"),
  new Resource("stone","stone"),
  new Resource("food","berry")
];

const npcs = [//Npc("type","name")
  lumberjack = new Npc("wood","lumberjack"),
  new Npc("stone","miner"),
  new Npc("food","farmer")
];

const storages = [//Storage("type")
  new Storage("wood"),
  new Storage("stone"),
  new Storage("food")
];

const houses = [//Storage("type")
  new House("wood"),
  new House("stone"),
  new House("food")
];

function update(){
for (let i = 0; i < npcs.length; i++) {
    const npc = npcs[i];

    // Find the first resource that matches the npc's type and is alive
    const targetResource = resources.find(r => r.type === npc.type && r.alive);

    // Move the npc toward the resource if found
    if (targetResource) {
      npc.moveTo(targetResource.x, targetResource.y);
    }
  }

  // Example: move lumberjack specifically to the wood house
  const woodhouse = houses.find(h => h.type === "wood");
  if (woodhouse) {
    lumberjack.moveTo(woodhouse.x, woodhouse.y);
  }
}

function draw(){
    for (let i = 0; i < resources.length; i++) {
    resources[i].draw();
    }
    for (let i = 0; i < npcs.length; i++) {
    npcs[i].draw();
    }
    for (let i = 0; i < storages.length; i++) {
    storages[i].draw();
    }
    for (let i = 0; i < houses.length; i++) {
    houses[i].draw();
    }
}

function init() {
    man.src = "pixel_art_man.png";
    window.requestAnimationFrame(newframe);
}


function newframe() {
    context.clearRect(0, 0, canvas.width, canvas.height); // clear before redraw
    update()   
    draw()
    window.requestAnimationFrame(newframe);
}


init()