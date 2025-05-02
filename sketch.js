
let img;
let tiles = [];
let cols, rows;
let tileSize = 24;

function preload() {
  img = loadImage("cloud.png");
}

function setup() {
  createCanvas(960, 540);
  cols = floor(img.width / tileSize);
  rows = floor(img.height / tileSize);
  imageMode(CORNER);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let tile = img.get(x * tileSize, y * tileSize, tileSize, tileSize);
      tiles.push({
        img: tile,
        x: x * tileSize,
        y: y * tileSize,
        ox: x * tileSize,
        oy: y * tileSize,
        vx: 0,
        vy: 0
      });
    }
  }
}

function draw() {
  background("#1976D2");

  for (let t of tiles) {
    let d = dist(mouseX, mouseY, t.ox + tileSize / 2, t.oy + tileSize / 2);

    if (d < 100) {
      let angle = atan2(t.oy - mouseY, t.ox - mouseX);
      let force = map(d, 0, 100, 12, 0);
      t.vx += cos(angle) * force;
      t.vy += sin(angle) * force;
    }

    t.vx += (t.ox - t.x) * 0.05;
    t.vy += (t.oy - t.y) * 0.05;

    t.vx *= 0.88;
    t.vy *= 0.88;
    t.x += t.vx;
    t.y += t.vy;

    image(t.img, t.x, t.y);
  }
}
