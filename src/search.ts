import { RegistrySearchResults } from '.';
import { searchRegistry } from './npm';

export const search = (
  text = '',
  scope = '',
  limit = 100,
): Promise<RegistrySearchResults> => {
  return searchRegistry(text, scope, limit);
};
