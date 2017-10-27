"use strict";

/**
 * A* Algorithm for searching 
 *
 *
 */

//GLOBAL SETUP//


// Start and end
// Width and height of each cell of world
var start = 0;
var end = 0;
var w = 0;
var h = 0;
var statusx = "Starting";
var openx = 0;
var closedx = 0;
var current = 0;
// The road taken
var path = [];

// How many columns and rows?
var cols = 50;
var rows = 50;
// This will be the 2D array
var world = new Array(cols);
// Open and closed set
var openSet = [];
var closedSet = []; // for storing the old nodes

// guess of how far it is between two nodes
function heuristic(node, otheNode) {
	return dist(node.x, node.y, otheNode.x, otheNode.y);
}

function createTheWorld() {
	var i = void 0;
	var j = void 0;

	// Making a 2D array
	for (i = 0; i < cols; i++) {
		world[i] = new Array(rows);
	}

	for (i = 0; i < cols; i++) {
		for (j = 0; j < rows; j++) {
			world[i][j] = new Node(i, j);
		}
	}

	// All the closest Node
	for (i = 0; i < cols; i++) {
		for (j = 0; j < rows; j++) {
			world[i][j].addSurrounding(world);
		}
	}

	// Start and end
	start = world[0][0];
	end = world[cols - 1][rows - 1];
	//to make sure that the start and the end is not a block
	start.block = false;
	end.block = false;
	openSet.push(start);
	statusx = "Searching... ";
}

function setup() {
	createCanvas(displayWidth / 2, displayHeight / 2).position(150, 150);
	console.log('Starting ..');

	// Grid cell size
	w = width / cols;
	h = height / rows;
	createTheWorld();
}

function display() {
	// Draw current state of everything
	background(255);
	var i = 0;
	var j = 0;
	for (i = 0; i < cols; i++) {
		for (j = 0; j < rows; j++) {
			world[i][j].create(color(255, 255, 255)); // the land
		}
	}

	for (i = 0; i < closedSet.length; i++) {
		closedSet[i].create(color(0, 255, 0, 50)); //the closed
	}

	for (i = 0; i < openSet.length; i++) {
		openSet[i].create(color(255, 255, 255)); // the open
	}
	// Find the path by working backwards
	path = [];
	var temp = current;
	path.push(temp);
	while (temp.previous) {
		path.push(temp.previous);
		temp = temp.previous;
	}
	document.getElementById('status').innerHTML = statusx;
	document.getElementById('closed').innerHTML = closedx;
	document.getElementById('open').innerHTML = openx;
	document.getElementById('f').innerHTML = current.f.toFixed(4) + "%";
	var millisecond = millis();
	document.getElementById('time').innerHTML = Math.round(millisecond / 1000) + "s";
	endShape();
	// Drawing path as continuous line
	noFill();
	stroke(0, 255, 0);
	strokeWeight(w / 2);
	beginShape();
	for (i = 0; i < path.length; i++) {
		vertex(path[i].x * w + w / 2, path[i].y * h + h / 2);
	}
	endShape();
}

function draw() {
	closedx = closedSet.length;
	openx = openSet.length;
	// Am I still searching?
	if (openSet.length > 0) {

		// Best next option
		var winnerNodeIndex = 0;
		openSet.map(function (node) {
			if (node.f < openSet[winnerNodeIndex].f) {
				winnerNodeIndex = openSet.indexOf(node);
			}
		});

		current = openSet[winnerNodeIndex];
		// Did I finish?
		if (current === end) {
			noLoop(); //STOP
			statusx = "Done. ";
		}
		// no I didn't finish yet, so
		// we will remove the current node from the openset
		// and add it to the closedset
		var toRemoveIndex = openSet.indexOf(current);
		if (toRemoveIndex !== -1) {
			openSet.splice(toRemoveIndex, 1);
		}
		closedSet.push(current);

		// Check all the closestNodes and calculate The Cost
		var closestNodes = current.nearNodes;
		for (var i = 0; i < closestNodes.length; i++) {
			var closestNode = closestNodes[i];

			// Valid next spot?
			if (!closedSet.includes(closestNode) && !closestNode.block) {
				var tempG = current.g + heuristic(closestNode, current);

				// Is this a better path than before?
				var newPath = false;
				if (openSet.includes(closestNode)) {
					if (tempG < closestNode.g) {
						closestNode.g = tempG;
						newPath = true;
					}
				} else {
					closestNode.g = tempG;
					newPath = true;
					openSet.push(closestNode);
				}

				// Yes, it's a better path
				if (newPath) {
					closestNode.h = heuristic(closestNode, end);
					closestNode.f = closestNode.g + closestNode.h;
					closestNode.previous = current;
				}
			}
		}
	} else {
		// Uh oh, no solution
		console.log('no solution');
		noLoop();
		statusx = "I can't find any solution. ";
		return;
	}
	display();
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Node Class
* Used To Constract New Node in Our Map
*	url of the algorithm: https://en.wikipedia.org/wiki/A*_search_algorithm
*/
var Node = function () {
		/**
  *constructor
  *@param {x} the x position of the node
  *@param {y} the y position of the node
  */
		function Node(x, y) {
				_classCallCheck(this, Node);

				this.x = x;
				this.y = y;
				this.f = 0; //the main function of A* Algorithm
				this.g = 0; // g(n) is the cost of the path from the start node to n
				this.h = 0; //h(n) is a heuristic that estimates the cost of the cheapest path from n to the goal
				this.nearNodes = []; // an array to hold the near nodes from the current node
				this.previousNode = null;
				this.block = this.createBlock(); // if the current node is act like a wall or block ? createBlock() make it randomly 
		}

		_createClass(Node, [{
				key: "createBlock",
				value: function createBlock() {
						return random(1) > 0.6;
				}

				/**
    *constructor
    *@param {color} the color of the current node in the colomn
    */

		}, {
				key: "create",
				value: function create(color) {
						//if it a wall
						if (this.block) {
								fill(255, 0, 0); // make it red ?
								noStroke();
								ellipse(this.x * w + w / 2, this.y * h + h / 2, w / 2, h / 2); //make it like a node or circle
						} else {
								fill(color);
								rect(this.x * w, this.y * h, w, h); // make a rectangle
						}
				}
				/**
    *Add Surrounding Nodes
    *@param {grid} the grid of the current node in the space
    */

		}, {
				key: "addSurrounding",
				value: function addSurrounding(grid) {
						var i = this.x;
						var j = this.y;
						if (i < cols - 1) {
								this.nearNodes.push(grid[i + 1][j]);
						}
						if (i > 0) {
								this.nearNodes.push(grid[i - 1][j]);
						}
						if (j < rows - 1) {
								this.nearNodes.push(grid[i][j + 1]);
						}
						if (j > 0) {
								this.nearNodes.push(grid[i][j - 1]);
						}
						if (i > 0 && j > 0) {
								this.nearNodes.push(grid[i - 1][j - 1]);
						}
						if (i < cols - 1 && j > 0) {
								this.nearNodes.push(grid[i + 1][j - 1]);
						}
						if (i > 0 && j < rows - 1) {
								this.nearNodes.push(grid[i - 1][j + 1]);
						}
						if (i < cols - 1 && j < rows - 1) {
								this.nearNodes.push(grid[i + 1][j + 1]);
						}
				}
		}]);

		return Node;
}();
