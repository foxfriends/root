import Clearing from "server/model/board/Clearing";
import ForestZone from "server/model/board/ForestZone";

export type Prompts = {
  text?: string | { key: string; params: { [key: string]: string | number } };
  cards?: { image: string; value?: any; available?: boolean }[];
  clearings?: Clearing[];
  forests?: ForestZone[];
  prices?: boolean;
  outcast?: boolean;
};
