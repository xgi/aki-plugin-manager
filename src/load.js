const { readFileSync } = require("fs");
const { join, resolve } = require("path");

module.exports = (baseDir, name, requireFn = require) => {
  const pluginDir = join(baseDir, name);
  const packageFile = join(pluginDir, "package.json");

  const { main } = JSON.parse(readFileSync(packageFile, "utf-8"));
  const mainPath = resolve(pluginDir, main || "index.js");

  return requireFn(mainPath);
};
