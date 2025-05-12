
let img;
let tiles = [];
let cols, rows;
let tileSize = 24;

function preload() {
  img = loadImage("cloud.png?v=5");
}

function setup() {
  pixelDensity(1);
  noSmooth();
  createCanvas(windowWidth, windowHeight);
  initTiles();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initTiles();
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
      let tile = createImage(tileSize, tileSize);
      tile.copy(
        img,
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize,
        0,
        0,
        tileSize,
        tileSize
      );
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

  for (let t of tiles) {
    let dx = t.x + tileSize / 2 - mouseX;
    let dy = t.y + tileSize / 2 - mouseY;
    let d = sqrt(dx * dx + dy * dy);

    if (d < 150) {
      let angle = atan2(dy, dx);
      let force = map(d, 0, 150, 8, 0);
      t.vx += cos(angle) * force;
      t.vy += sin(angle) * force;
    }

    let ax = (t.ox - t.x) * 0.1;
    let ay = (t.oy - t.y) * 0.1;

    t.vx += ax;
    t.vy += ay;

    t.vx *= 0.85;
    t.vy *= 0.85;

    t.x += t.vx;
    t.y += t.vy;

    image(t.img, int(t.x), int(t.y));
  }
}
