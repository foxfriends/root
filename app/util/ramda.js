/**
 * Ramdalike utility functions
 */
import { append, applyTo, curry, flip, includes, is, when, zip } from 'ramda';

export const memberOf = flip(includes);
export const pairWith = curry((f, a) => [a, f(a)]);
export const fmt = (strings, ...interpolations) => {
  return (input) => {
    const values = interpolations.map(when(is(Function), applyTo(input)));
    return zip(strings, append('', values))
      .flat()
      .join('');
  };
};
