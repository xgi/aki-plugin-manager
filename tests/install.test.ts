import { install } from '../src/install';
import nock from 'nock';
import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import { assert } from 'chai';

describe('Install tests', () => {
  const installDir = path.join(__dirname, 'fixtures', 'install');
  const pkgsDir = path.join(__dirname, 'fixtures', 'packages');

  describe('install latest package', () => {
    const scope = nock('https://registry.npmjs.org')
      .get('/is-number/latest')
      .reply(
        200,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        JSON.stringify(require('./fixtures/packages/is-number/latest.json')),
      )
      .get('/is-number/-/is-number-7.0.0.tgz')
      .reply(
        200,
        fs.readFileSync(path.join(pkgsDir, 'is-number', 'is-number-7.0.0.tgz')),
        { 'Content-Type': 'application/octet-stream' },
      );

    before((done) => {
      rimraf(installDir, () => {
        install('is-number', 'latest', installDir, done);
      });
    });

    it('should make proper registry requests', () => {
      assert.isTrue(scope.isDone());
    });

    it('should have new plugin directory', () => {
      assert.isTrue(fs.existsSync(path.join(installDir, 'is-number')));
    });

    it('should have plugin data extracted', () => {
      assert.isTrue(fs.existsSync(path.join(installDir, 'is-number', 'index.js')));
    });

    after((done) => {
      rimraf(installDir, done);
    });
  });

  describe('install specific version', () => {
    const scope = nock('https://registry.npmjs.org')
      .get('/is-number/6.0.0')
      .reply(
        200,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        JSON.stringify(require('./fixtures/packages/is-number/6.0.0.json')),
      )
      .get('/is-number/-/is-number-6.0.0.tgz')
      .reply(
        200,
        fs.readFileSync(path.join(pkgsDir, 'is-number', 'is-number-6.0.0.tgz')),
        { 'Content-Type': 'application/octet-stream' },
      );

    before((done) => {
      rimraf(installDir, () => {
        install('is-number', '6.0.0', installDir, done);
      });
    });

    it('should make proper registry requests', () => {
      assert.isTrue(scope.isDone());
    });

    it('should have new plugin directory', () => {
      assert.isTrue(fs.existsSync(path.join(installDir, 'is-number')));
    });

    it('should have plugin data extracted', () => {
      assert.isTrue(fs.existsSync(path.join(installDir, 'is-number', 'index.js')));
    });

    after((done) => {
      rimraf(installDir, done);
    });
  });
});
