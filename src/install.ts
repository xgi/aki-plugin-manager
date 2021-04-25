import { join } from "path";
import tar from "tar";
import fs from "fs";
import https from "https";
import { getManifest, PackageManifest } from "./npm";

const _download = (url: string, dir: string) => {
  fs.mkdirSync(dir, { recursive: true });

  return new Promise<void>((resolve, reject) => {
    https.get(url, (stream) => {
      stream.on("close", () => {
        resolve();
      });

      stream.pipe(tar.x({ strip: 1, C: dir }));
    });
  });
};

const _install = (
  name: string,
  version: string,
  installDir: string,
  callback: (error?: Error) => void
) => {
  let dependencies: { [name: string]: string };

  return getManifest(name, version)
    .then((pkg: PackageManifest) => {
      dependencies = pkg.dependencies;
      return _download(pkg.dist.tarball, installDir);
    })
    .then(() => {
      let funcs: Promise<Error | null>[] = [];
      if (dependencies) {
        funcs = Object.entries(dependencies).map(
          (dependency: [string, string]) => {
            return new Promise<Error | null>(
              (resolve: (value: any) => void, reject) => {
                _install(
                  dependency[0],
                  dependency[1],
                  join(installDir, "node_modules", dependency[0]),
                  resolve
                );
              }
            );
          }
        );
      }

      return Promise.all(funcs);
    })
    .then(() => {
      if (callback) callback();
    })
    .catch((err: Error) => {
      if (callback) callback(err);
    });
};

export const install = (
  name: string,
  version: string,
  baseDir: string,
  callback: (error?: Error) => void
) => {
  const installDir = join(baseDir, name);

  return _install(name, version, installDir, callback);
};
