import { readFileSync } from 'fs';
import { join, resolve } from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load = (baseDir: string, name: string, requireFn = require): any => {
  const pluginDir: string = join(baseDir, name);
  const packageFile: string = join(pluginDir, 'package.json');

  const { main } = JSON.parse(readFileSync(packageFile, 'utf-8'));
  const mainPath: string = resolve(pluginDir, main || 'index.js');

  return requireFn(mainPath);
};
