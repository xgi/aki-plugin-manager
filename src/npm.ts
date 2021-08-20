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

export type RegistrySearchResults = {
  objects: {
    package: RegistrySearchPackage;
    score: {
      final: number;
      detail: {
        quality: number;
        popularity: number;
        maintenance: number;
      };
    };
    searchScore: number;
  }[];
  total: number;
  time: string;
};

export type RegistrySearchPackage = {
  name: string;
  scope: string;
  version: string;
  description: string;
};

const _cleanVersion = (version: string): string => {
  if (version === "latest") return version;
  return version.replace(/^\D/, "");
};

export const getManifest = (
  name: string,
  version: string
): Promise<PackageManifest> => {
  return new Promise<PackageManifest>((resolve) => {
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

export const searchRegistry = (
  text: string,
  scope: string,
  limit: number
): Promise<RegistrySearchResults> => {
  const scopeText = scope ? `scope:${scope} ` : "";

  return new Promise((resolve) => {
    https.get(
      `${BASE_URL}/-/v1/search?size=${limit}&text=${scopeText}${text}`,
      (stream) => {
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
