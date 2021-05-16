import { readFileSync } from 'fs';
import { join } from 'path';
import rimraf from 'rimraf';

const _verifyPackage = (name: string, packageDir: string) => {
  const packageFile = join(packageDir, 'package.json');
  const packageName = JSON.parse(readFileSync(packageFile, 'utf-8'))['name'];
  return name === packageName;
};

export const uninstall = (
  name: string,
  baseDir: string,
  callback: () => void,
): void => {
  const packageDir = join(baseDir, name);

  if (_verifyPackage(name, packageDir)) {
    rimraf(packageDir, callback);
  }
};
