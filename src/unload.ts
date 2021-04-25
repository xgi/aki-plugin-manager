import { join } from "path";

export const unload = (baseDir: string, name: string, requireFn = require) => {
  const pluginDir: string = join(baseDir, name);

  Object.keys(requireFn.cache).forEach((item) => {
    if (item.startsWith(pluginDir)) {
      delete requireFn.cache[item];
    }
  });
};
