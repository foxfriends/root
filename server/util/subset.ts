export default function containsAll <T> ([...superset]: T[], [...subset]: T[], comparator: (a: T, b: T) => boolean = (a, b) => a === b) {
  for (const element of subset) {
    const i = superset.findIndex(e => comparator(e, element));
    if (i === -1) {
      return false;
    }
    superset.splice(i, 1);
  }
  return true;
}
