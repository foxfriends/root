import ValueGrammar from './value.pegjs';

// We gotta do a bit of weirdness here to get the Struct class out of the pegjs file
// and onto window so that we can then export it here and use it normally throughout
// the code.
ValueGrammar.parse('hello(world)');
export const Struct = window.Struct;

export const parse = (string) => ValueGrammar.parse(string);
