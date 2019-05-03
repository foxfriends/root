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
