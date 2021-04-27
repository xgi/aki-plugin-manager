import { searchRegistry } from "./npm";

export const search = ({ text = "", scope = "" }) => {
  return searchRegistry({ text, scope });
};
