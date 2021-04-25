import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const _getVersion = (packageFile: string): string => {
  const { version } = JSON.parse(readFileSync(packageFile, "utf-8"));
  return version;
};

export const list = (baseDir: string): [string, string][] => {
  if (!existsSync(baseDir)) return [];

  const packageDirs: string[] = readdirSync(baseDir).filter((name) =>
    statSync(join(baseDir, name)).isDirectory()
  );

  let packages: [string, string][] = [];
  packageDirs.forEach((packageDir: string) => {
    if (!packageDir.startsWith("@")) {
      const packageFile = join(baseDir, packageDir, "package.json");
      packages.push([packageDir, _getVersion(packageFile)]);
      return;
    }

    const subDirs: string[] = readdirSync(join(baseDir, packageDir));
    subDirs.forEach((subDir) => {
      if (statSync(join(baseDir, packageDir, subDir)).isDirectory()) {
        const packageFile: string = join(
          baseDir,
          packageDir,
          subDir,
          "package.json"
        );
        packages.push([`${packageDir}/${subDir}`, _getVersion(packageFile)]);
      }
    });
  });

  return packages;
};
