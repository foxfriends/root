/**
 * Ramdalike utility functions
 */
import { __, assoc, flip, includes } from 'ramda';

export const memberOf = flip(includes);
export const build = assoc(__, __, {});
