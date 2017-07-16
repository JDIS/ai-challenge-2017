import sys
import math
import heapq
from collections import namedtuple
from itertools import chain, zip_longest


def grouper(iterable, n, fillvalue=None):
    "Collect data into fixed-length chunks or blocks"
    # grouper('ABCDEFG', 3, 'x') --> ABC DEF Gxx"
    args = [iter(iterable)] * n
    return zip_longest(*args, fillvalue=fillvalue)


NORTH, EAST, SOUTH, WEST, STILL = range(5)
DIRECTIONS = [NORTH, EAST, SOUTH, WEST]


class PriorityQueue:
    def __init__(self):
        self.elements = []

    def empty(self):
        return len(self.elements) == 0

    def put(self, item, priority):
        heapq.heappush(self.elements, (priority, item))

    def get(self):
        return heapq.heappop(self.elements)[1]

def opposite_cardinal(direction):
    "Returns the opposing cardinal direction."
    return (direction + 2) % 4 if direction != STILL else STILL


Square = namedtuple('Square', 'x y owner strength production')


Move = namedtuple('Move', 'square direction')


class GameMap:
    def __init__(self, size_string, production_string, map_string=None):
        self.width, self.height = tuple(map(int, size_string.split()))
        self.production = tuple(tuple(map(int, substring)) for substring in grouper(production_string.split(), self.width))
        self.contents = None
        self.get_frame(map_string)
        self.starting_player_count = len(set(square.owner for square in self)) - 1

    def get_frame(self, map_string=None):
        "Updates the map information from the latest frame provided by the Halite game environment."
        if map_string is None:
            map_string = get_string()
        split_string = map_string.split()
        owners = list()
        while len(owners) < self.width * self.height:
            counter = int(split_string.pop(0))
            owner = int(split_string.pop(0))
            owners.extend([owner] * counter)
        assert len(owners) == self.width * self.height
        assert len(split_string) == self.width * self.height
        self.contents = [[Square(x, y, owner, strength, production)
                          for x, (owner, strength, production)
                          in enumerate(zip(owner_row, strength_row, production_row))]
                         for y, (owner_row, strength_row, production_row)
                         in enumerate(zip(grouper(owners, self.width),
                                          grouper(map(int, split_string), self.width),
                                          self.production))]

    def __iter__(self):
        "Allows direct iteration over all squares in the GameMap instance."
        return chain.from_iterable(self.contents)

    def neighbors(self, square, n=1, include_self=False):
        "Iterable over the n-distance neighbors of a given square.  For single-step neighbors, the enumeration index provides the direction associated with the neighbor."
        assert isinstance(include_self, bool)
        assert isinstance(n, int) and n > 0
        if n == 1:
            combos = ((0, -1), (1, 0), (0, 1), (-1, 0), (0, 0))   # NORTH, EAST, SOUTH, WEST, STILL ... matches indices provided by enumerate(game_map.neighbors(square))
        else:
            combos = ((dx, dy) for dy in range(-n, n+1) for dx in range(-n, n+1) if abs(dx) + abs(dy) <= n)
        return (self.contents[(square.y + dy) % self.height][(square.x + dx) % self.width] for dx, dy in combos if include_self or dx or dy)

    def get_target(self, square, direction):
        "Returns a single, one-step neighbor in a given direction."
        dx, dy = ((0, -1), (1, 0), (0, 1), (-1, 0), (0, 0))[direction]
        return self.contents[(square.y + dy) % self.height][(square.x + dx) % self.width]

    def get_distance(self, sq1, sq2):
        "Returns Manhattan distance between two squares."
        dx = min(abs(sq1.x - sq2.x), sq1.x + self.width - sq2.x, sq2.x + self.width - sq1.x)
        dy = min(abs(sq1.y - sq2.y), sq1.y + self.height - sq2.y, sq2.y + self.height - sq1.y)
        return dx + dy

    def get_direction_toward(self, sq1, sq2):
        best_cost = math.inf
        best_direction = None
        for direction in DIRECTIONS:
            cur_cost = self.get_distance(self.get_target(sq1, direction), sq2)
            if cur_cost < best_cost:
                best_direction = direction
                best_cost = cur_cost

        return best_direction

    def get_direction_toward_with_A_star(self, sq1, sq2):
        frontier = PriorityQueue()
        frontier.put(sq1, 0)
        came_from = {}
        cost_so_far = {}
        came_from[sq1] = None
        cost_so_far[sq1] = 0

        while not frontier.empty():
            current = frontier.get()

            if current == sq2:
                break

            for next in self.neighbors(current):
                new_cost = cost_so_far[current] + 1  # La valeur 1 represente le cout pour passer d'un carre a l'autre.
                if next not in cost_so_far or new_cost < cost_so_far[next]:
                    cost_so_far[next] = new_cost
                    priority = new_cost + self.get_distance(sq2, next)
                    frontier.put(next, priority)
                    came_from[next] = current
        next_tile = sq2
        while came_from[next_tile] != sq1: # TODO valider le !=
            next_tile = came_from[next_tile]
        deltaX = sq1.x - next_tile.x
        deltaY = sq1.y - next_tile.y
        # ((0, -1), (1, 0), (0, 1), (-1, 0), (0, 0))   # NORTH, EAST, SOUTH, WEST, STILL
        if deltaX == -1 and deltaY == 0:
            return WEST
        elif deltaX == 1 and deltaY == 0:
            return EAST
        elif deltaX == 0 and deltaY == -1:
            return NORTH
        elif deltaX == 0 and deltaY == 1:
            return SOUTH
        else:
            return STILL

#################################################################
# Functions for communicating with the Halite game environment  #
#################################################################


def send_string(s):
    sys.stdout.write(s)
    sys.stdout.write('\n')
    sys.stdout.flush()


def get_string():
    return sys.stdin.readline().rstrip('\n')


def get_init():
    playerID = int(get_string())
    m = GameMap(get_string(), get_string())
    return playerID, m


def send_init(name):
    send_string(name)


def translate_cardinal(direction):
    "Translate direction constants used by this Python-based bot framework to that used by the official Halite game environment."
    return (direction + 1) % 5


def send_frame(moves):
    send_string(' '.join(str(move.square.x) + ' ' + str(move.square.y) + ' ' + str(translate_cardinal(move.direction)) for move in moves))
