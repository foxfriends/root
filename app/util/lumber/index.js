import { curry, flip, has, prop, zipWith } from 'ramda';
import ValueGrammar from './value.pegjs';

export class Struct {
    constructor(name, contents = undefined) {
        this.name = name;
        this.contents = contents;
    }

    get isAtom() {
        return this.contents === undefined;
    }
}

export class Variable {
    constructor(name) {
        this.name = name;
    }
}

// These are referenced from the grammar, supplied through window because I don't know how else
// to inject a value into the compiled module?
window.Struct = Struct;
window.Variable = Variable;

export class UnificationError extends Error {}

export const parse = (string) => ValueGrammar.parse(string);
export const extract = curry((string, value) => unify(parse(string), value));
export const unify = curry((pattern, value) => {
  console.log(pattern, value);
  let binding = {};
  function unifyInner(pattern, value) {
    if (pattern instanceof Variable) {
      binding[pattern.name] = value;
    } else if (pattern instanceof Struct && value instanceof Struct && pattern.name === value.name) {
      unifyInner(pattern.contents, value.contents);
    } else if (Array.isArray(pattern) && Array.isArray(value) && pattern.length === value.length) {
      zipWith(unifyInner, pattern, value);
    } else if (typeof pattern === 'object' && typeof value === 'object') {
      const allkeys = union(Object.keys(pattern), Object.keys(value));
      if (allkeys.every(flip(has)(pattern)) && allkeys.every(flip(has)(value))) {
        const lhs = allkeys.map(flip(prop)(pattern));
        const rhs = allkeys.map(flip(prop)(value));
        zipWith(unifyInner, lhs, rhs);
      } else {
        throw new UnificationError;
      }
    } else if (pattern !== value) {
      throw new UnificationError;
    }
  }
  unifyInner(pattern, value);
  return binding;
});
