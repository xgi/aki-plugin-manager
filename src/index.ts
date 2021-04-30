import { manager } from "./manager";
import { install } from "./install";
import { uninstall } from "./uninstall";
import { list } from "./list";
import { search } from "./search";
import { load } from "./load";
import { unload } from "./unload";

import { PackageManifest, RegistrySearchResults } from "./npm";

export default { manager, install, uninstall, list, search, load, unload };
export { PackageManifest, RegistrySearchResults };
