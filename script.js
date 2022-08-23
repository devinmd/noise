//map
var map = [];
var mapsize = 8;
// elevation
var elevationcount = 10;
var contrast = 10;
// canvas
var canv = document.querySelector("#canv");
var ctx = canv.getContext("2d");
ctx.imageSmoothingEnabled = false;
// assuming the canvas is square
var w = canv.width;
var cubesize = w / mapsize;
// counters
var count = [];

var mode = 0;

var smoothened = [];

function init() {
  generate();
}

function generate() {
  // reset count and clear canvas
  count = Array(64).fill(0);
  map = [];
  left = 0;
  above = 0;
  ctx.clearRect(0, 0, canv.width, canv.height);

  // create the map
  if (mode == 1) {
    // diagonal
    for (let i = 0; i < mapsize; i++) {
      // across
      map[i] = [];
      for (let e = 0; e < mapsize; e++) {
        let change = Math.floor(Math.random() * 5) - 2; // -2 -1 0 1 2
        if (change == -2 || change == 2) {
          change = 0;
          // -1, 0, 0, 0, 1
        }
        // down
        if (e == 0 && i == 0) {
          map[i][e] = { elevation: Math.floor(Math.random() * (parseInt(elevationcount) + 1)) }; // set very first cube to a random number inside of elevationcount
        } else {
          let p = Math.floor(Math.random() * 2);
          if (i == 0) {
            // first column
            p = 0;
          }
          if (e == 0) {
            // first in column
            p = 1;
          }
          if (p == 1) {
            // is not the first column
            // is the first inside of column
            // left
            map[i][e] = { elevation: map[i - 1][e].elevation + change };
            if (map[i - 1][e].elevation + change < 0 || map[i - 1][e].elevation + change > elevationcount) {
              // if its below 0 or above the max, just set it to the one before it
              map[i][e] = { elevation: map[i - 1][e].elevation };
            }
          } else {
            // can be first column
            // is not first inside column
            // above
            map[i][e] = { elevation: map[i][e - 1].elevation + change };
            if (map[i][e - 1].elevation + change < 0 || map[i][e - 1].elevation + change > elevationcount) {
              // if its below 0 or above the max, just set it to the one before it
              map[i][e] = { elevation: map[i][e - 1].elevation };
            }
          }
        }
      }
    }
  } else if (mode == 0) {
    // random
    for (let i = 0; i < mapsize; i++) {
      // across
      map[i] = [];
      for (let e = 0; e < mapsize; e++) {
        // down
        map[i][e] = { elevation: Math.floor(Math.random() * elevationcount) };
      }
    }
  } else if (mode == 2) {
    // smooth
    for (let i = 0; i < mapsize; i++) {
      // across
      map[i] = [];
      for (let e = 0; e < mapsize; e++) {
        let change = Math.floor(Math.random() * 5) - 2; // -2 -1 0 1 2
        if (change == -2 || change == 2) {
          change = 0;
          // -1, 0, 0, 0, 1
        }
        // down
        if (e == 0 && i == 0) {
          map[i][e] = { elevation: Math.floor(Math.random() * (parseInt(elevationcount) + 1)) }; // set very first cube to a random number inside of elevationcount
        } else {
          if (i == 0) {
            // first column
            map[i][e] = { elevation: map[i][e - 1].elevation + change };
            // clamp
            if (map[i][e].elevation < 0 || map[i][e].elevation > elevationcount) {
              map[i][e] = { elevation: map[i][e - 1].elevation };
            }
          } else if (e == 0) {
            // first in column
            map[i][e] = { elevation: map[i - 1][e].elevation + change };
            // clamp
            if (map[i][e].elevation < 0 || map[i][e].elevation > elevationcount) {
              map[i][e] = { elevation: map[i - 1][e].elevation };
            }
          } else {
            map[i][e] = { elevation: (map[i][e - 1].elevation + map[i - 1][e].elevation) / 2 + change };
            // clamp
            if (map[i][e].elevation < 0 || map[i][e].elevation > elevationcount) {
              map[i][e] = { elevation: (map[i][e - 1].elevation + map[i - 1][e].elevation) / 2 };
            }
          }
        }
      }
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
  document.querySelector("#elevationcount").innerHTML = "Elevation Range: " + elevationcount;
  let weight = 100 / (mapsize * mapsize);
  document.querySelector("#count").innerHTML = "";
  for (let p = 0; p < elevationcount; p++) {
    document.querySelector("#count").innerHTML += p + ": " + count[p] + " (" + count[p] * weight + "%)" + "<br> ";
  }
}

init();
