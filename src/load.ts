import { readFileSync } from "fs";
import { join, resolve } from "path";

export const load = (baseDir: string, name: string, requireFn = require) => {
  const pluginDir: string = join(baseDir, name);
  const packageFile: string = join(pluginDir, "package.json");

  const { main } = JSON.parse(readFileSync(packageFile, "utf-8"));
  const mainPath: string = resolve(pluginDir, main || "index.js");

  return requireFn(mainPath);
};
