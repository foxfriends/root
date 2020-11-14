import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { get, set } from 'shades';
import { last } from 'ramda';

class Lens extends Observable {
  #lens;
  #source;

  constructor(source, lens) {
    if (!(source instanceof BehaviorSubject)) {
      throw new TypeError('Source of a lens must be a BehaviorSubject');
    }
    super((observer) => source
      .pipe(map(get(...lens)))
      .subscribe(observer));
    this.#lens = lens;
    this.#source = source;
  }

  set(value) {
    this.#source.next(set(...this.#lens)(value)(this.#source.getValue()));
  }
}

function LensBuilder(lens = []) {
  return new Proxy(() => {}, {
    get(target, prop) {
      return LensBuilder([...lens, prop]);
    },

    apply(target, self, args) {
      if (last(lens) == 'call') { lens.pop(); }
      const source = args[0] ?? self;
      return new Lens(source, lens);
    },
  });
}

export default LensBuilder();
