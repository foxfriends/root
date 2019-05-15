import Clearing from './board/Clearing';
import ForestZone from './board/ForestZone';

export type Prompts = {
  text?: string | { key: string, params: { [key: string]: string | number }},
  cards?: { image: string, value?: any, available?: boolean }[],
  clearings?: Clearing[],
  forests?: ForestZone[],
  prices?: boolean,
  outcast?: boolean,
};
