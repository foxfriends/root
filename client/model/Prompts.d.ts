import Clearing from './board/Clearing';

export type Prompts = {
  text?: string | { key: string, params: { [key: string]: string | number }},
  cards?: { image: string, value?: any, available?: boolean }[],
  clearings?: Clearing[],
};
