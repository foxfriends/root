/**
 * Ramdalike utility functions
 */
import { flip, includes } from 'ramda';

export const memberOf = flip(includes);
