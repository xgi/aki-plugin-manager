import https from "https";
import { IncomingMessage } from "node:http";

const BASE_URL = "https://registry.npmjs.org";

export type PackageManifest = {
  name: string;
  version: string;
  description: string;
  dependencies: { [name: string]: string };
  dist: {
    tarball: string;
  };
};

const _cleanVersion = (version: string): string => {
  if (version === "latest") return version;
  return version.replace(/^\D/, "");
};

export const getManifest = (
  name: string,
  version: string
): Promise<PackageManifest> => {
  return new Promise<PackageManifest>((resolve, reject) => {
    https.get(
      `${BASE_URL}/${name}/${_cleanVersion(version)}`,
      (stream: IncomingMessage) => {
        let body = "";

        stream.on("data", (chunk) => {
          body += chunk;
        });

        stream.on("end", () => {
          resolve(JSON.parse(body));
        });
      }
    );
  });
};
