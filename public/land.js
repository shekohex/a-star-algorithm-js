/**
 * A* Algorithm for searching 
 *
 *
 */

//GLOBAL SETUP//


// Start and end
// Width and height of each cell of world
let start = 0
let end = 0
let w = 0
let h = 0
let statusx = "Starting"
let openx = 0
let closedx = 0
let current = 0
// The road taken
let path = []

// How many columns and rows?
const cols = 50
const rows = 50
// This will be the 2D array
let world = new Array(cols)
// Open and closed set
let openSet = []
let closedSet = [] // for storing the old nodes

// guess of how far it is between two nodes
function heuristic(node, otheNode) {
	return dist(node.x, node.y, otheNode.x, otheNode.y)
}

function createTheWorld() {
	let i
	let j

	// Making a 2D array
	for (i = 0; i < cols; i++) {
		world[i] = new Array(rows)
	}

	for (i = 0; i < cols; i++) {
		for (j = 0; j < rows; j++) {
			world[i][j] = new Node(i, j)
		}
	}

	// All the closest Node
	for (i = 0; i < cols; i++) {
		for (j = 0; j < rows; j++) {
			world[i][j].addSurrounding(world)
		}
	}


	// Start and end
	start = world[0][0]
	end = world[cols - 1][rows - 1]
	//to make sure that the start and the end is not a block
	start.block = false
	end.block = false
	openSet.push(start)
	statusx = "Searching... "
}

function setup() {
	createCanvas(displayWidth / 2, displayHeight / 2).position(150, 150)
	console.log('Starting ..')

	// Grid cell size
	w = width / cols
	h = height / rows
	createTheWorld()
}

function display() {
	// Draw current state of everything
	background(255)
	let i = 0
	let j = 0
	for (i = 0; i < cols; i++) {
		for (j = 0; j < rows; j++) {
			world[i][j].create(color(255, 255, 255)) // the land
		}
	}

	for (i = 0; i < closedSet.length; i++) {
		closedSet[i].create(color(0, 255, 0, 50)) //the closed
	}

	for (i = 0; i < openSet.length; i++) {
		openSet[i].create(color(255, 255, 255)) // the open
	}
	// Find the path by working backwards
	path = []
	let temp = current
	path.push(temp)
	while (temp.previous) {
		path.push(temp.previous);
		temp = temp.previous
	}
	document.getElementById('status').innerHTML = statusx
	document.getElementById('closed').innerHTML = closedx
	document.getElementById('open').innerHTML = openx
	document.getElementById('f').innerHTML = current.f.toFixed(4) + "%"
	let millisecond = millis()
	document.getElementById('time').innerHTML = Math.round(millisecond / 1000) + "s"
	endShape()
	// Drawing path as continuous line
	noFill()
	stroke(0, 255, 0)
	strokeWeight(w / 2)
	beginShape()
	for (i = 0; i < path.length; i++) {
		vertex(path[i].x * w + w / 2, path[i].y * h + h / 2)
	}
	endShape()
}

function draw() {
	closedx = closedSet.length
	openx = openSet.length
	// Am I still searching?
	if (openSet.length > 0) {

		// Best next option
		let winnerNodeIndex = 0
		openSet.map(node => {
			if (node.f < openSet[winnerNodeIndex].f) {
				winnerNodeIndex = openSet.indexOf(node)
			}
		})

		current = openSet[winnerNodeIndex]
		// Did I finish?
		if (current === end) {
			noLoop() //STOP
			statusx = "Done. "
		}
		// no I didn't finish yet, so
		// we will remove the current node from the openset
		// and add it to the closedset
		let toRemoveIndex = openSet.indexOf(current)
		if (toRemoveIndex !== -1) {
			openSet.splice(toRemoveIndex, 1)
		}
		closedSet.push(current)

		// Check all the closestNodes and calculate The Cost
		let closestNodes = current.nearNodes
		for (let i = 0; i < closestNodes.length; i++) {
			var closestNode = closestNodes[i]

			// Valid next spot?
			if (!closedSet.includes(closestNode) && !closestNode.block) {
				var tempG = current.g + heuristic(closestNode, current)

				// Is this a better path than before?
				var newPath = false
				if (openSet.includes(closestNode)) {
					if (tempG < closestNode.g) {
						closestNode.g = tempG
						newPath = true
					}
				} else {
					closestNode.g = tempG
					newPath = true
					openSet.push(closestNode)
				}

				// Yes, it's a better path
				if (newPath) {
					closestNode.h = heuristic(closestNode, end)
					closestNode.f = closestNode.g + closestNode.h
					closestNode.previous = current
				}
			}

		}
	} else {
		// Uh oh, no solution
		console.log('no solution')
		noLoop()
		statusx = "I can't find any solution. "
		return
	}
	display()
}