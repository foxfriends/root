import { curry, prop } from 'ramda';

export default prop('detail');

export const key = curry(function key(key, handler, event) {
  if (event.key === key) {
    handler();
  }
});
