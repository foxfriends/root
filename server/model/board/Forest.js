import Board from './Board.js';
import Clearing from './Clearing.js';
import Slot from './Slot.js';
import Suit from '../Suit.js';

export default class Forest extends Board {
  constructor() {
    super(
      'forest',
      [
        new Clearing(547, 619, Suit.fox, [new Slot(430, 566)], true, 2),
        new Clearing(4213, 1044, Suit.mouse, [new Slot(4204, 966), new Slot(4312, 1180)], true, 3),
        new Clearing(4008, 3863, Suit.rabbit, [new Slot(3905, 3819)], true, 0),
        new Clearing(548, 3622, Suit.rabbit, [new Slot(721, 3594)], true, 1),
        new Clearing(2635, 446, Suit.rabbit, [new Slot(2479, 340), new Slot(2739, 314)]),
        new Clearing(4364, 2336, Suit.fox, [new Slot(4187, 2370), new Slot(4398, 2146, true)]),
        new Clearing(2818, 3424, Suit.mouse, [new Slot(2798, 3230), new Slot(2636, 3478)]),
        new Clearing(1732, 3926, Suit.fox, [new Slot(1902, 3724), new Slot(1826, 4006)]),
        new Clearing(508, 1762, Suit.mouse, [new Slot(608, 1642), new Slot(408, 2026)]),
        new Clearing(2054, 1250, Suit.rabbit, [new Slot(1856, 1176), new Slot(2120, 1512, true)]),
        new Clearing(3050, 2160, Suit.mouse, [new Slot(2966, 1994), new Slot(3142, 2142), new Slot(2938, 2290, true)]),
        new Clearing(1496, 2444, Suit.fox, [new Slot(1488, 2628), new Slot(1694, 2416, true)]),
      ],
      [
        [0, 4], [0, 9], [0, 8],
        [1, 4], [1, 5], [1, 9],
        [2, 5], [2, 6], [2, 10],
        [3, 7], [3, 8], [3, 11],
        [5, 10],
        [6, 7], [6, 11],
        [9, 11],
        [10, 11],
      ],
      [ [4, 9], [9, 10], [10, 6], [6, 3] ],
    );
  }
}
