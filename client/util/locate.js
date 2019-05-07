export default function locate (piece) {
  return this.clearings
    .find(clearing => clearing.pieces.find(p =>
      piece.faction === p.faction && p.name === piece.name
    ));
}
