import { RegistrySearchResults } from ".";
import { searchRegistry } from "./npm";

export const search = (
  text: string = "",
  scope: string = "",
  limit: number = 100
): Promise<RegistrySearchResults> => {
  return searchRegistry(text, scope, limit);
};
