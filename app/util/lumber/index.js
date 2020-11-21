import { curry, flip, has, prop, union, zipWith } from 'ramda';
import ValueGrammar from './value.pegjs';
import logger from '../logger';

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

class Value {
  #source;

  constructor(string) {
    this.#source = string;
    this.value = ValueGrammar.parse(this.#source);
  }

  toString() { return this.#source; }
}

class Binding {
  #value;

  constructor(value) {
    this.#value = value;
  }

  toString() {
    return this.#value.toString();
  }
}

// These are referenced from the grammar, supplied through window because I don't know how else
// to inject a value into the compiled module?
window.Struct = Struct;
window.Variable = Variable;

export const parse = (string) => {
  try {
    return new Value(string);
  } catch (error) {
    logger.error(error);
    return null;
  }
};

export const match = curry((string, value) => unify(parse(string), value));

export const unify = curry((pattern, value) => {
  if (!(pattern instanceof Value) || !(value instanceof Value)) {
    throw new TypeError('Can only unify instances of class Value.');
  }
  let binding = new Binding(value);

  class UnificationError extends Error {}
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

  try {
    unifyInner(pattern.value, value.value);
    return binding;
  } catch {
    return null;
  }
});
