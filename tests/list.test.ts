import { list } from "../src/list";
import path from "path";
import { assert } from "chai";

describe("List tests", () => {
  const emptyInstallDir = path.join(
    __dirname,
    "fixtures",
    "exampleInstall",
    "empty"
  );
  const nonemptyInstallDir = path.join(
    __dirname,
    "fixtures",
    "exampleInstall",
    "nonempty"
  );

  describe("list with no plugins installed", () => {
    it("should give an empty array", () => {
      const result = list(emptyInstallDir);
      assert.isTrue(result && result.length === 0);
    });
  });

  describe("list with one plugin installed", () => {
    it("should give nonempty array", () => {
      const result = list(nonemptyInstallDir);
      assert.isTrue(result !== undefined);
      assert.isTrue(result.length > 0);
    });

    it("should have exactly one element", () => {
      const result = list(nonemptyInstallDir);
      assert.isTrue(result.length === 1);
    });

    it("should have correct element", () => {
      const result = list(nonemptyInstallDir);
      const foundPlugin = result[0];
      assert.isTrue(foundPlugin[0] === "is-number");
      assert.isTrue(foundPlugin[1] === "7.0.0");
    });
  });
});
