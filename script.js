// list of all values
var map = [];

// size of map (20x20)
var mapsize = 20;

// how many iterations the smoothen algorithm does
var smoothen_iterations = 1

// elevation range (0-9)
var elevationcount = 10;

// color difference between elevation values
var contrast = 10;

// rgb weights
var rgb = {r: 0, g: 3, b: 0}

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
}

function generate() {
	// reset count and clear canvas
	count = Array(64).fill(0);
	map = [];
	left = 0;
	above = 0;
	ctx.clearRect(0, 0, canv.width, canv.height);

	// create the map
	// random
	for (let i = 0; i < mapsize; i++) {
		// across
		map[i] = [];
		for (let e = 0; e < mapsize; e++) {
			// down
			map[i][e] = { elevation: Math.floor(Math.random() * elevationcount) };
		}
	}

	// iterate through again and smoothen
	for(let p = 0; p< smoothen_iterations; p++){
		for (let s = 1; s < mapsize-1; s++) {
		// across
		for (let c = 1; c < mapsize-1; c++) {
			// down
			// neighboring values
			let u = map[s][c - 1].elevation // up
			let ur = map[s -1][c +1].elevation
		
			let d = map[s][c + 1].elevation
			let dl = map[s + 1][c-1].elevation
			let dr = map[s +1][c+1].elevation
			
			let l = map[s - 1][c].elevation
			let r = map[s + 1][c].elevation

			// average value
			if(){
				
			}
			let a = ( u + d+ l + r) / 4

			// set value
			map[s][c].elevation = a
			console.log(a)
		}
	}
	}
	

	// display the map
	for (let i = 0; i < map.length; i++) {
		for (let e = 0; e < map[i].length; e++) {
			// elevation color
			ctx.fillStyle = `rgb(${255 - map[i][e].elevation * contrast},${255 - map[i][e].elevation * (contrast - 3)},${255 - map[i][e].elevation * contrast
				})`;
			// location
			let x = i * cubesize;
			let y = e * cubesize;
			// draw cube
			ctx.fillRect(x, y, cubesize, cubesize);

			count[Math.floor(map[i][e].elevation)] += 1;
		}
	}
	document.querySelector("#mapsize").innerHTML = "Map Size: " + mapsize + "x" + mapsize;
	document.querySelector("#cubecount").innerHTML = "Cube Count: " + mapsize * mapsize;
		document.querySelector("#smootheniterations").innerHTML = "Smoothen Iterations: " + smoothen_iterations;
	document.querySelector("#elevationcount").innerHTML = "Elevation Range: " + elevationcount;
	let weight = 100 / (mapsize * mapsize);
	document.querySelector("#count").innerHTML = "<strong>Elevation Distribution: (Floored)</strong><br>";
	let max = Math.max(...count);

	for (let p = 0; p < elevationcount; p++) {
		if (p == count.indexOf(max)) {
			document.querySelector("#count").innerHTML += '<strong>'+p + ": " + count[p] * weight + "% (" + count[p] + ")" + "</strong><br> ";
		} else {
			document.querySelector("#count").innerHTML += p + ": " + count[p] * weight + "% (" + count[p] + ")" + "<br> ";
		}
	}
}

init();
