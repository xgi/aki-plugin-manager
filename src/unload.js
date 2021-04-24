const { join } = require("path");

module.exports = (baseDir, name, requireFn = require) => {
  const pluginDir = join(baseDir, name);

  Object.keys(requireFn.cache).forEach((item) => {
    if (item.startsWith(pluginDir)) {
      delete requireFn.cache[item];
    }
  });
};
