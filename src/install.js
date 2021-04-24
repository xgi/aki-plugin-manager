const { join } = require("path");
const tar = require("tar");
const fs = require("fs");
const https = require("https");
const npm = require("./npm");

const _download = (url, dir) => {
  fs.mkdirSync(dir, { recursive: true });

  return new Promise((resolve, reject) => {
    https.get(url, (stream) => {
      stream.on("close", () => {
        resolve();
      });

      stream.pipe(tar.x({ strip: 1, C: dir }));
    });
  });
};

const _install = (name, version, installDir, callback) => {
  let dependencies;

  return npm
    .get(name, version)
    .then((pkg) => {
      dependencies = pkg.dependencies;
      return _download(pkg.dist.tarball, installDir);
    })
    .then(() => {
      let funcs = [];
      if (dependencies) {
        funcs = Object.entries(dependencies).map((dependency) => {
          return new Promise((resolve, reject) => {
            _install(
              dependency[0],
              dependency[1],
              join(installDir, "node_modules", dependency[0]),
              resolve
            );
          });
        });
      }

      return Promise.all(funcs);
    })
    .then(() => {
      if (callback) callback();
    });
};

module.exports = (name, version, baseDir, callback) => {
  const installDir = join(baseDir, name);

  return _install(name, version, installDir, callback);
};
