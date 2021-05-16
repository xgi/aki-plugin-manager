import { load } from '../src/load';
import path from 'path';
import { assert } from 'chai';

describe('Load tests', () => {
  const nonemptyInstallDir = path.join(
    __dirname,
    'fixtures',
    'exampleInstall',
    'nonempty',
  );

  describe('uses given require function', () => {
    let called = true;
    let called_with: string | undefined = undefined;
    const reqFn = (id: string) => {
      called = true;
      called_with = id;
    };

    before(() => {
      called = false;
      called_with = undefined;
    });

    it('should call require function', () => {
      load(nonemptyInstallDir, 'is-number', reqFn as NodeRequire);
      assert.isTrue(called);
    });

    it('should call with correct source', () => {
      load(nonemptyInstallDir, 'is-number', reqFn as NodeRequire);
      assert.isTrue(
        called_with === path.join(nonemptyInstallDir, 'is-number', 'index.js'),
      );
    });
  });
});
