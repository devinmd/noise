// list of all values
var map = [];

// size of map in cubes
var mapsize = 20;

// how many iterations the smoothen algorithm does
var smoothen_iterations = 2;

// elevation range (0-9)
var elevationcount = 10;

// color difference between elevation values
var contrast = 10;

// rgb weights
var rgbweight = { r: -2, g: -4, b: 0 };

// canvas
var canv = document.querySelector("#canv");
var ctx = canv.getContext("2d");
ctx.imageSmoothingEnabled = false;

// canvas width in px
var w = canv.width;

// size of each cube in px
var cubesize = w / mapsize;

// counter
var count = [];

function init() {
  generate();

  document.querySelector("#mapsizeinput1").value = mapsize;
  document.querySelector("#mapsizeinput2").value = mapsize;
  document.querySelector("#smootheniterationsinput").value = smoothen_iterations;
}

function generate() {
  // reset count and clear canvas
  count = Array(64).fill(0);
  map = [];
  left = 0;
  above = 0;
  ctx.clearRect(0, 0, canv.width, canv.height);

  // create the first map iteration, completely random
  // adds 2 extra for the space on the ends
  // 20x20 => 22x22
  for (let i = 0; i < parseInt(mapsize) + 2; i++) {
    // across
    map[i] = [];
    for (let e = 0; e < parseInt(mapsize) + 2; e++) {
      // down
      map[i][e] = { elevation: Math.floor(Math.random() * elevationcount) };
    }
  }

  // iterate through again and smoothen
  for (let p = 0; p < smoothen_iterations; p++) {
    // across
    for (let s = 1; s < parseInt(mapsize) + 1; s++) {
      // down
      for (let c = 1; c < parseInt(mapsize) + 1; c++) {
        console.log(s + ", " + c);

        // neighboring values
        let ul = map[s - 1][c + 1].elevation; // up left
        let u = map[s][c - 1].elevation; // up
        let ur = map[s + 1][c + 1].elevation; // up right
        let r = map[s + 1][c].elevation; // right
        let dr = map[s + 1][c + 1].elevation; // down right
        let d = map[s][c + 1].elevation; // down
        let dl = map[s + 1][c - 1].elevation; // down left
        let l = map[s - 1][c].elevation; // down left

        // average value
        let a = (ul + u + ur + r + dr + d + dl + l) / 8;

        // set value
        map[s][c].elevation = a;

        // if it's the last iteration, draw the cube
        if (p == smoothen_iterations - 1) {
          ctx.fillStyle = `rgb(
            ${255 - map[s][c].elevation * (contrast + rgbweight.r)},
            ${255 - map[s][c].elevation * (contrast + rgbweight.g)},
            ${255 - map[s][c].elevation * (contrast + rgbweight.b)}
      
            )`;
          // location
          let x = (s - 1) * cubesize;
          let y = (c - 1) * cubesize;
          // draw cube
          ctx.fillRect(x, y, cubesize, cubesize);

          count[Math.floor(map[s][c].elevation)] += 1;
        }
      }
    }
  }

  if (smoothen_iterations == 0) {
    for (let s = 1; s < parseInt(mapsize) + 1; s++) {
      for (let c = 1; c < parseInt(mapsize) + 1; c++) {
        ctx.fillStyle = `rgb(
          ${255 - map[s][c].elevation * (contrast + rgbweight.r)},
          ${255 - map[s][c].elevation * (contrast + rgbweight.g)},
          ${255 - map[s][c].elevation * (contrast + rgbweight.b)}
    
          )`;
        // location
        let x = (s - 1) * cubesize;
        let y = (c - 1) * cubesize;
        // draw cube
        ctx.fillRect(x, y, cubesize, cubesize);

        count[Math.floor(map[s][c].elevation)] += 1;
      }
    }
  }

  document.querySelector("#mapsize").innerHTML = "Map Size: " + mapsize + "x" + mapsize;
  document.querySelector("#cubecount").innerHTML = "Cube Count: " + mapsize * mapsize;
  document.querySelector("#elevationcount").innerHTML = "Elevation Range: " + elevationcount;
  let weight = 100 / (mapsize * mapsize);
  document.querySelector("#count").innerHTML = "<strong>Elevation Distribution: (Floored)</strong><br>";
  let max = Math.max(...count);

  for (let p = 0; p < elevationcount; p++) {
    if (p == count.indexOf(max)) {
      document.querySelector("#count").innerHTML +=
        "<strong>" + p + ": " + count[p] * weight + "% (" + count[p] + ")" + "</strong><br> ";
    } else {
      document.querySelector("#count").innerHTML += p + ": " + count[p] * weight + "% (" + count[p] + ")" + "<br> ";
    }
  }
}

init();
