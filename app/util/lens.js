import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { get, set } from 'shades';

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
    source.next(set(...this.#lens)(value)(this.#source.getValue()));
  }
}

function LensBuilder(lens = []) {
  return new Proxy(() => {}, {
    get(target, prop, receiver) {
      return LensBuilder([...lens, prop]);
    },

    apply(target, self, args) {
      const source = args[0] ?? self;
      return new Lens(source, lens);
    },
  });
}

export default LensBuilder();
