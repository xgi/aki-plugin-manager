const { existsSync, readdirSync, readFileSync, statSync } = require("fs");
const { join } = require("path");

const _getVersion = (packageFile) => {
  const { version } = JSON.parse(readFileSync(packageFile, "utf-8"));
  return version;
};

module.exports = (baseDir) => {
  if (!existsSync(baseDir)) return [];

  const packageDirs = readdirSync(baseDir).filter((name) =>
    statSync(join(baseDir, name)).isDirectory()
  );

  let packages = [];
  packageDirs.forEach((packageDir) => {
    if (!packageDir.startsWith("@")) {
      const packageFile = join(baseDir, packageDir, "package.json");
      packages.push([packageDir, _getVersion(packageFile)]);
      return;
    }

    const subDirs = readdirSync(join(baseDir, packageDir));
    subDirs.forEach((subDir) => {
      if (statSync(join(baseDir, packageDir, subDir)).isDirectory()) {
        const packageFile = join(baseDir, packageDir, subDir, "package.json");
        packages.push([`${packageDir}/${subDir}`, _getVersion(packageFile)]);
      }
    });
  });

  return packages;
};
