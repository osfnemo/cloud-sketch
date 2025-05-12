
let img;
let tiles = [];
let cols, rows;
let tileSize = 24;
let lastMoved = 0;
let fadeEdge; // for vignette

function preload() {
  img = loadImage("cloud.png?v=8");
}

function setup() {
  pixelDensity(1);
  noSmooth();
  createCanvas(windowWidth, windowHeight);
  initTiles();
  fadeEdge = createGraphics(width, height);
  fadeEdge.noFill();
  for (let i = 0; i < 100; i++) {
    fadeEdge.stroke(0, 0, 0, map(i, 0, 100, 0, 255));
    fadeEdge.strokeWeight(2);
    fadeEdge.rect(i, i, width - i * 2, height - i * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initTiles();
  fadeEdge = createGraphics(width, height);
  fadeEdge.noFill();
  for (let i = 0; i < 100; i++) {
    fadeEdge.stroke(0, 0, 0, map(i, 0, 100, 0, 255));
    fadeEdge.strokeWeight(2);
    fadeEdge.rect(i, i, width - i * 2, height - i * 2);
  }
}

function mouseMoved() {
  lastMoved = millis();
}

function initTiles() {
  tiles = [];
  cols = int(img.width / tileSize);
  rows = int(img.height / tileSize);
  imageMode(CORNER);
  
  let offsetX = (width - img.width) / 2;
  let offsetY = (height - img.height) / 2;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let tile = img.get(x * tileSize, y * tileSize, tileSize, tileSize);
      tiles.push({
        img: tile,
        x: x * tileSize + offsetX,
        y: y * tileSize + offsetY,
        ox: x * tileSize + offsetX,
        oy: y * tileSize + offsetY,
        vx: 0,
        vy: 0
      });
    }
  }
}

function draw() {
  clear();

  let mx = constrain(mouseX, 0, width);
  let my = constrain(mouseY, 0, height);
  let fade = constrain(map(millis() - lastMoved, 0, 1200, 1, 0), 0, 1);

  for (let t of tiles) {
    let dx = t.x + tileSize / 2 - mx;
    let dy = t.y + tileSize / 2 - my;
    let d = sqrt(dx * dx + dy * dy);

    if (d < 150) {
      let angle = atan2(dy, dx);
      let force = map(d, 0, 150, 10, 0) * fade;
      t.vx += cos(angle) * force;
      t.vy += sin(angle) * force;
    }

    let ax = (t.ox - t.x) * 0.08;
    let ay = (t.oy - t.y) * 0.08;

    t.vx += ax;
    t.vy += ay;

    t.vx *= 0.85;
    t.vy *= 0.85;

    t.x += t.vx;
    t.y += t.vy;

    image(t.img, t.x, t.y);
  }

  image(fadeEdge, 0, 0); // Apply soft edge vignette
}
