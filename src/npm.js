const https = require("https");

const BASE_URL = "https://registry.npmjs.org";

const _cleanVersion = (version) => {
  if (version === "latest") return version;
  return version.replace(/^\D/, "");
};

const get = (name, version) => {
  return new Promise((resolve, reject) => {
    https.get(`${BASE_URL}/${name}/${_cleanVersion(version)}`, (stream) => {
      let body = "";

      stream.on("data", (chunk) => {
        body += chunk;
      });

      stream.on("end", () => {
        resolve(JSON.parse(body));
      });
    });
  });
};

module.exports = {
  get,
};
