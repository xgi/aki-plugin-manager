import { install } from './install';
import { uninstall } from './uninstall';
import { list } from './list';
import { search } from './search';
import { load } from './load';
import { unload } from './unload';

import {
  PackageManifest,
  RegistrySearchResults,
  RegistrySearchPackage,
} from './npm';

export default { install, uninstall, list, search, load, unload };
export { install, uninstall, list, search, load, unload };
export { PackageManifest, RegistrySearchResults, RegistrySearchPackage };
