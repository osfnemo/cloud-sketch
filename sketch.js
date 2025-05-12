
let img;
let tiles = [];
let cols, rows;
let tileSize = 24;
let lastMoved = 0;
let mouseActive = false;
let sweepFrame = 0;
let sweepDone = false;
let sweepTriggered = false;
let sweepStartTime;
let chordPlayed = false;
let jazzChord;

function preload() {
  img = loadImage("cloud.png?v=15");
  soundFormats('mp3', 'wav');
  jazzChord = loadSound('jazz_chord.wav');
}

function setup() {
  pixelDensity(1);
  noSmooth();
  createCanvas(windowWidth, windowHeight);
  initTiles();
  sweepStartTime = millis();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initTiles();
}

function mouseMoved() {
  lastMoved = millis();
  if (!mouseActive && jazzChord && !chordPlayed) {
    jazzChord.play();
    chordPlayed = true;
  }
  mouseActive = true;
  sweepDone = true;
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

  if (!mouseActive && !sweepTriggered && millis() - sweepStartTime > 2000) {
    sweepTriggered = true;
  }

  if (sweepTriggered && !sweepDone) {
    sweepFrame++;
    if (sweepFrame > 120) {
      sweepDone = true;
    }
  }

  let mx = constrain(mouseX, 0, width);
  let my = constrain(mouseY, 0, height);
  let fade = constrain(map(millis() - lastMoved, 0, 1200, 1, 0), 0, 1);

  for (let t of tiles) {
    if (!sweepDone && sweepTriggered) {
      let wave = sin((t.oy / height) * PI + sweepFrame * 0.1);
      t.vy += wave * 1.5;
    } else if (mouseActive) {
      let dx = t.x + tileSize / 2 - mx;
      let dy = t.y + tileSize / 2 - my;
      let d = sqrt(dx * dx + dy * dy);

      if (d < 180) {
        let angle = atan2(dy, dx);
        let force = easeOutExpo(map(d, 0, 180, 24, 0)) * fade;
        t.vx += cos(angle) * force;
        t.vy += sin(angle) * force;
      }
    }

    let ax = (t.ox - t.x) * 0.1;
    let ay = (t.oy - t.y) * 0.1;

    t.vx += ax;
    t.vy += ay;

    t.vx *= 0.86;
    t.vy *= 0.86;

    t.x += t.vx;
    t.y += t.vy;

    image(t.img, t.x, t.y);
  }
}

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - pow(2, -10 * x);
}
