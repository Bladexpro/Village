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
  return {// -100 to be used like padding
    x: Math.random() * (dimensions.width-100),
    y: Math.random() * (dimensions.height-100)
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

  update(){
    if(!this.alive){
      this.alive = true;
      this.targeted = false;
      const { x, y } = randomCoords();
      this.x = x;
      this.y = y;
    }
  }
}

class Storage {
  constructor(type = "wood", maxstorage = 10) {
    const {x, y} = randomCoords();
    this.x = x;
    this.y = y;
    this.type = type;
    this.stored = 0;
    this.maxstorage = maxstorage;
  }

  draw() {
    drawSquare(this.x, this.y, dimensions.storage, colors.storage);
    drawText(this.x, this.y - 10,`${this.type}: ${this.stored}`);
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
    this.targex = 0;
    this.targey = 0;
    this.state = "idle";//Ex:idle,working
    this.inventory = 0;
    this.workingTime = 100;
    this.workprogress = 0;
    this.type = type;
    this.name = name;
  }

  draw() {  
    context.drawImage(man, this.x, this.y, dimensions.npc, dimensions.npc)
    drawText(this.x, this.y - 10, `${this.name} ${this.workprogress}`);
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

    isAt(x, y) {
    return Math.abs(this.x - x) < dimensions.speed*2 && Math.abs(this.y - y) < dimensions.speed*2;
    }


    update(){
        let targetStorage = undefined;
        let targetResource = undefined;
        switch(this.state) {
          case 'idle':
            targetStorage = storages.find(s => s.type === this.type && s.stored < s.maxstorage);
            if(targetStorage){
              targetResource = resources.find(r => r.type === this.type && r.alive && !r.targeted);
              if (targetResource) {
                //NEEDS to WORK to targetStorage
                this.state = 'toResource';
                // Find returns the first to pass the test resource that matches the type and is alive and not targeted
                
                // Move the npc toward the resource if found
                if (targetResource) {
                  targetResource.targeted = true;
                  this.state = 'toResource'
                  this.targex = targetResource.x;
                  this.targey = targetResource.y;
                  this.moveTo(this.targex, this.targey);
                  }
              }
            }  
            else
              this.state = 'idle';
              const targetHouse = houses.find(h => h.type === this.type);
              if (targetHouse) {
                this.moveTo(targetHouse.x, targetHouse.y);
              }
            break;
          case 'toResource':
            if(this.isAt(this.targex,this.targey))
              this.state = 'working';
            else
              this.moveTo(this.targex, this.targey);
            break;
          case 'working':
            if(this.workprogress < this.workingTime)
              this.workprogress++;
            else{
              this.state = 'toStorage';
              this.workprogress = 0;
              targetResource = resources.find(r => r.type === this.type && r.alive && r.targeted && this.isAt(this.x,this.y));
              if(!targetResource){
                this.state = 'idle'
                break;
              }
              targetResource.alive = false
              targetStorage = storages.find(s => s.type === this.type && s.stored < s.maxstorage);
              if(targetStorage){
                this.inventory++
                this.targex = targetStorage.x;
                this.targey = targetStorage.y;
              }
              else
                this.state = 'idle'
            }
            break;
          case 'toStorage':
            targetStorage = storages.find(s => s.type === this.type && s.stored < s.maxstorage);
            if(targetStorage){
              if(this.isAt(this.targex,this.targey)){
                targetStorage.stored++
                this.inventory--;
                this.state = 'idle';
              }
              else{
                this.moveTo(this.targex, this.targey);
              }
            }else{
              this.inventory--;
              this.state = 'idle';
              }
            
            break;
          default:
            this.state = 'idle';
        }
    }
}

const man = new Image();

const resources = [//Resource("type","name")
  new Resource("wood"),
  new Resource("stone"),
  new Resource("food")
];

const npcs = [//Npc("type","name")
  new Npc("wood","lumberjack"),
  new Npc("stone","miner"),
  new Npc("food","farmer")
];

const storages = [//Storage("type",maxstorage)
  new Storage("wood",5),
  new Storage("stone",5),
  new Storage("food",5)
];

const houses = [//Storage("type")
  new House("wood"),
  new House("stone"),
  new House("food")
];

function update(){
  for (let i = 0; i < npcs.length; i++) {
    npcs[i].update()
  }
    for (let i = 0; i < resources.length; i++) {
    resources[i].update()
  }
}

function draw(){
    for (let i = 0; i < houses.length; i++) {
    houses[i].draw();
    }
    for (let i = 0; i < npcs.length; i++) {
    npcs[i].draw();
    }
    for (let i = 0; i < storages.length; i++) {
    storages[i].draw();
    }
    for (let i = 0; i < resources.length; i++) {
    resources[i].draw();
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