const assert = require('assert');
const StringSet = require('Set');
const Heap = require('heap');
const dict = require('dict');

const STILL = 0;
const NORTH = 1;
const EAST = 2;
const SOUTH = 3;
const WEST = 4;

const DIRECTIONS = [STILL, NORTH, EAST, SOUTH, WEST];
const CARDINALS = [NORTH, EAST, SOUTH, WEST];

const ATTACK = 0;
const STOP_ATTACK = 1;

class Location {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Site {
  constructor(owner = 0, strength = 0, production = 0) {
    this.owner = owner;
    this.strength = strength;
    this.production = production;
  }
}

class Move {
  constructor(loc = new Location(), direction = STILL) {
    this.loc = loc;
    this.direction = direction;
  }
}

class GameMap {
  constructor(width = 0, height = 0, numberOfPlayers = 0) {
    this.width = width;
    this.height = height;
    this.numberOfPlayers = numberOfPlayers;
    this.contents = [];

    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row.push(new Site(0, 0, 0));
      }
      this.contents.push(row);
    }
  }

  inBounds(l) {
    return l.x >= 0 && l.x < this.width && l.y >= 0 && l.y < this.height;
  }

  getDistance(l1, l2) {
    let dx = Math.abs(l1.x - l2.x);
    let dy = Math.abs(l1.y - l2.y);

    if (dx > (this.width / 2)) {
      dx = this.width - dx;
    }

    if (dy > (this.height / 2)) {
      dy = this.height - dy;
    }

    return dx + dy;
  }

  getAngle(l1, l2) {
    let dx = l2.x - l1.x;
    let dy = l2.y - l1.y;

    if (dx > (this.width - dx)) {
      dx -= this.width;
    } else if (-dx > (this.width + dx)) {
      dx += this.width;
    }

    if (dy > (this.height - dy)) {
      dy -= this.height;
    } else if (-dy > (this.height + dy)) {
      dy += this.height;
    }

    return Math.atan2(dy, dx);
  }

  getLocation(loc, direction) {
    let {
      x,
      y
    } = loc;
    if (direction === STILL) {
      // nothing
    } else if (direction === NORTH) {
      y -= 1;
    } else if (direction === EAST) {
      x += 1;
    } else if (direction === SOUTH) {
      y += 1;
    } else if (direction === WEST) {
      x -= 1;
    }

    if (x < 0) {
      x = this.width - 1;
    } else {
      x %= this.width;
    }

    if (y < 0) {
      y = this.height - 1;
    } else {
      y %= this.height;
    }

    return {
      x,
      y
    };
  }

  getSite(l, direction = STILL) {
    const {
      x,
      y
    } = this.getLocation(l, direction);
    return this.contents[y][x];
  }

  getNeighbors(loc) {
    let neighbor = [];
    neighbor.push(new Location((loc.x - 1) % this.width, loc.y));
    neighbor.push(new Location((loc.x + 1) % this.width, loc.y));
    neighbor.push(new Location(loc.x, (loc.xy + 1) % this.height));
    neighbor.push(new Location(loc.x, (loc.xy - 1) % this.height));
    return neighbor;
  }
}


function aStar(params) {
  assert.ok(params.start !== undefined);
  assert.ok(params.isEnd !== undefined);
  var hash = params.hash || defaultHash;

  var startNode = {
    data: params.start,
    g: 0,
    h: getDistance(params.start, params.isEnd),
  };
  var bestNode = startNode;
  startNode.f = startNode.h;
  // leave .parent undefined
  var closedDataSet = new StringSet();
  var openHeap = new Heap(heapComparator);
  var openDataMap = dict();
  openHeap.push(startNode);
  openDataMap.set(hash(startNode.data), startNode);
  while (openHeap.size()) {
    var node = openHeap.pop();
    openDataMap.delete (hash(node.data));
    if (params.isEnd(node.data)) {
      // done
      return {
        status: 'success',
        cost: node.g,
        path: reconstructPath(node),
      };
    }
    // not done yet
    closedDataSet.add(hash(node.data));
    var neighbors = getNeighbors(node.data);
    for (var i = 0; i < neighbors.length; i++) {
      var neighborData = neighbors[i];
      if (closedDataSet.contains(hash(neighborData))) {
        // skip closed neighbors
        continue;
      }
      var gFromThisNode = node.g + 1;//We set the distance is set to 1 between each tile.
      var neighborNode = openDataMap.get(hash(neighborData));
      var update = false;
      if (neighborNode === undefined) {
        // add neighbor to the open set
        neighborNode = {
          data: neighborData,
        };
        // other properties will be set later
        openDataMap.set(hash(neighborData), neighborNode);
      } else {
        if (neighborNode.g < gFromThisNode) {
          // skip this one because another route is faster
          continue;
        }
        update = true;
      }
      // found a new or better route.
      // update this neighbor with this node as its new parent
      neighborNode.parent = node;
      neighborNode.g = gFromThisNode;
      neighborNode.h = getDistance(neighborData, params.isEnd);
      neighborNode.f = gFromThisNode + neighborNode.h;
      if (neighborNode.h < bestNode.h)
        bestNode = neighborNode;
      if (update) {
        openHeap.heapify();
      } else {
        openHeap.push(neighborNode);
      }
    }
  }
  // all the neighbors of every accessible node have been exhausted
  return {
    status: "noPath",
    cost: bestNode.g,
    path: reconstructPath(bestNode),
  };
}

function reconstructPath(node) {
  if (node.parent !== undefined) {
    var pathSoFar = reconstructPath(node.parent);
    pathSoFar.push(node.data);
    return pathSoFar;
  } else {
    // this is the starting node
    return [node.data];
  }
}

function defaultHash(node) {
    return node.toString();
}

function heapComparator(a, b) {
    return a.f - b.f;
}

module.exports = {
    STILL,
    NORTH,
    EAST,
    SOUTH,
    WEST,
    DIRECTIONS,
    CARDINALS,
    ATTACK,
    STOP_ATTACK,
    Location,
    Site,
    Move,
    GameMap,
    aStar
};
