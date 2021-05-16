import { join } from 'path';
import tar from 'tar';
import fs from 'fs';
import https from 'https';
import { getManifest, PackageManifest } from './npm';

const _download = (url: string, dir: string) => {
  fs.mkdirSync(dir, { recursive: true });

  return new Promise<void>((resolve) => {
    https.get(url, (stream) => {
      stream.on('end', () => {
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
  callback: (error?: Error) => void,
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (resolve: (value: any) => void) => {
                _install(
                  dependency[0],
                  dependency[1],
                  join(installDir, 'node_modules', dependency[0]),
                  resolve,
                );
              },
            );
          },
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
  callback: (error?: Error) => void,
): Promise<void> => {
  const installDir = join(baseDir, name);

  return _install(name, version, installDir, callback);
};
