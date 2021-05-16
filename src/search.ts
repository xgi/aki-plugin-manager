import { RegistrySearchResults } from '.';
import { searchRegistry } from './npm';

export const search = ({ text = '', scope = '' }): Promise<RegistrySearchResults> => {
  return searchRegistry({ text, scope });
};
