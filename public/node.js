/**
* Node Class
* Used To Constract New Node in Our Map
*	url of the algorithm: https://en.wikipedia.org/wiki/A*_search_algorithm
*/
class Node {
	/**
	*constructor
	*@param {x} the x position of the node
	*@param {y} the y position of the node
	*/
	constructor(x, y){
    this.x = x
    this.y = y
		this.f = 0 //the main function of A* Algorithm
		this.g = 0 // g(n) is the cost of the path from the start node to n
		this.h = 0 //h(n) is a heuristic that estimates the cost of the cheapest path from n to the goal
		this.nearNodes = [] // an array to hold the near nodes from the current node
		this.previousNode = null
		this.block = this.createBlock() // if the current node is act like a wall or block ? createBlock() make it randomly 
  }
	
	createBlock(){
		return random(1) > 0.6
	}
	
	/**
	*constructor
	*@param {color} the color of the current node in the colomn
	*/
	create(color){
		//if it a wall
		if(this.block){
			fill(255, 0, 0) // make it red ?
			noStroke()
			ellipse(this.x * w + w / 2, this.y * h + h / 2, w / 2, h / 2) //make it like a node or circle
		} else {
			fill(color)
      rect(this.x * w, this.y * h, w, h) // make a rectangle
		}
	}
	/**
	*Add Surrounding Nodes
	*@param {grid} the grid of the current node in the space
	*/
	addSurrounding(grid) {
		let i = this.x
    let j = this.y
    if (i < cols - 1) {
      this.nearNodes.push(grid[i + 1][j])
    }
    if (i > 0) {
      this.nearNodes.push(grid[i - 1][j])
    }
    if (j < rows - 1) {
      this.nearNodes.push(grid[i][j + 1])
    }
    if (j > 0) {
      this.nearNodes.push(grid[i][j - 1])
    }
    if (i > 0 && j > 0) {
      this.nearNodes.push(grid[i - 1][j - 1])
    }
    if (i < cols - 1 && j > 0) {
      this.nearNodes.push(grid[i + 1][j - 1])
    }
    if (i > 0 && j < rows - 1) {
      this.nearNodes.push(grid[i - 1][j + 1])
    }
    if (i < cols - 1 && j < rows - 1) {
      this.nearNodes.push(grid[i + 1][j + 1])
    }
	}
	
}
 