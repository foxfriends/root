import { Item } from '../Item.js';

export default class Board {
  constructor(
    name,
    clearings,
    paths,
    rivers,
  ) {
    this.name = name;
    this.clearings = clearings;
    this.paths = paths;
    this.rivers = rivers;

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

  locate(piece) {
    return this.clearings
      .find(clearing => clearing.pieces.includes(piece));
  }

  clearingDistance(start, end) {
    const visited = this.clearings.map(() => false);
    const distances = this.clearings.map(() => Infinity);
    distances[start] = 0;
    let current = start;
    while (current !== null && current !== end) {
      visited[current] = true;
      const neighbours = [];
      for (const [f, t] of paths) {
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
        .map((distance, i) => [distance, i])
        .filter((_, i) => !visited[i])
        .reduce((distance, node) => (distance[0] < node[0] ? distance : node), [Infinity, null])
        [1];
    }
    return distances[end];
  }
}
