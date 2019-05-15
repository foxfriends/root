import { Item } from '../Item';
import { Piece } from '../Piece';
import Clearing from './Clearing';
import ForestZone from './ForestZone';

export default class Board {
  itemSlots: {
    [key: string]: { x: number, y: number }[];
  };

  constructor(
    public name: string,
    public clearings: Clearing[],
    public paths: [number, number][],
    public rivers: [number, number][],
    public forests: ForestZone[],
    public scoreTrack: { x: number, y: number },
  ) {
    const x = 1088;
    const dx = 175;
    const y = [150, 320];

    this.itemSlots = {
      [Item.bag]: [{ x, y: y[0] }, { x, y: y[1] }],
      [Item.boot]: [{ x: x + dx, y: y[0] }, { x: x + dx, y: y[1] }],
      [Item.crossbow]: [{ x: x + 2 * dx, y: y[0] }],
      [Item.hammer]: [{ x: x + 2 * dx, y: y[1] }],
      [Item.sword]: [{ x: x + 3 * dx, y: y[0] }, { x: x + 3 * dx, y: y[1] }],
      [Item.tea]: [{ x: x + 4 * dx, y: y[0] }, { x: x + 4 * dx, y: y[1] }],
      [Item.coin]: [{ x: x + 5 * dx, y: y[0] }, { x: x + 5 * dx, y: y[1] }],
    };
  }

  locate(piece: Piece) {
    return this.clearings
      .find(clearing => clearing.pieces.includes(piece)
                     || clearing.buildings.includes(piece));
  }

  adjacentClearings(clearingIndex: number): Clearing[] {
    return this.clearings
      .filter(clearing => this.paths.some(path => path.includes(clearing.index) && path.includes(clearingIndex)))
      .filter(clearing => clearing.index !== clearingIndex);
  }

  clearingDistance(start: number, end: number) {
    const visited = this.clearings.map(() => false);
    const distances = this.clearings.map(() => Infinity);
    distances[start] = 0;
    let current = start;
    while (current !== null && current !== end) {
      visited[current] = true;
      const neighbours = [];
      for (const [f, t] of this.paths) {
        if (f === current || t === current) {
          const other = f === current ? t : f;
          if (!visited[other]) { neighbours.push(other); }
        }
      }
      for (const neighbour of neighbours) {
        if (distances[current] + 1 < distances[neighbour]) {
          distances[neighbour] = distances[current] + 1;
        }
      }
      current = distances
        .map((distance, i): [number, number] => [distance, i])
        .filter((_, i) => !visited[i])
        .reduce((
          distance: [number, number | null],
          node: [number, number],
        ) => (distance[0] < node[0] ? distance : node), <[number, null]>[Infinity, null])
        [1]!;
    }
    return distances[end];
  }
}
