const { readFileSync } = require("fs");
const { join } = require("path");
const rimraf = require("rimraf");

const _verifyPackage = (name, packageDir) => {
  const packageFile = join(packageDir, "package.json");
  const packageName = JSON.parse(readFileSync(packageFile, "utf-8"))["name"];
  return name === packageName;
};

module.exports = (name, baseDir, callback) => {
  const packageDir = join(baseDir, name);

  if (_verifyPackage(name, packageDir)) {
    rimraf(packageDir, callback);
  }
};
