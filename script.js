//map
var map = [];
var mapsize = 8;
// elevation
var elevationcount = 10;
var contrast = 10;
// canvas
var canv = document.querySelector("#canv");
var ctx = canv.getContext("2d");
// assuming the canvas is square
var w = canv.width;
var cubesize = w / mapsize;
// counters
var count = [];

function init() {
  generate();
}

function generate() {
  // reset count and clear canvas
  count = Array(64).fill(0);
  map = [];
  ctx.clearRect(0, 0, canv.width, canv.height);

  // create the map
  for (let i = 0; i < mapsize; i++) {
    // across
    map[i] = [];
    for (let e = 0; e < mapsize; e++) {
      // down
      map[i][e] = { elevation: Math.floor(Math.random() * elevationcount) };
    }
  }

  // display the map
  for (let i = 0; i < map.length; i++) {
    for (let e = 0; e < map[i].length; e++) {
      // elevation color
      ctx.fillStyle = `rgb(${255 - map[i][e].elevation * contrast},${255 - map[i][e].elevation * (contrast - 3)},${
        255 - map[i][e].elevation * contrast
      })`;
      // location
      let x = i * cubesize;
      let y = e * cubesize;
      // draw cube
      ctx.fillRect(x, y, cubesize, cubesize);
      count[map[i][e].elevation] += 1;
    }
  }
  document.querySelector("#mapsize").innerHTML = "Map Size: " + mapsize + "x" + mapsize;
  document.querySelector("#cubecount").innerHTML = "Cube Count: " + mapsize * mapsize;
  document.querySelector("#elevationcount").innerHTML = "Elevation: " + elevationcount;
  let weight = 100 / (mapsize * mapsize);
  document.querySelector("#count").innerHTML = "";
  for (let p = 0; p < elevationcount; p++) {
    document.querySelector("#count").innerHTML += p + ": " + count[p] + " (" + count[p] * weight + "%)" + "<br> ";
  }
}

init();
