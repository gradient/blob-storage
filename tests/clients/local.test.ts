import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as path from 'path';
import * as uuid from 'uuid';
import { exec as execCb } from 'child_process';
import { access as accessCb } from 'fs';
import * as Bluebird from 'bluebird';
import { LocalBlobStorage } from '../../src/clients';

chai.use(chaiAsPromised);
const assert = chai.assert;
const exec = Bluebird.promisify(execCb);
const access = Bluebird.promisify(accessCb);

describe('Local Blob Storage', function localBlobStorage() {
  const storageDir: string = path.join(__dirname, '../tmp');
  const picturePath: string = path.join(__dirname, '../fixtures/img.png');
  const locationId: string = 'elliot-blob-test';

  const store = new LocalBlobStorage({
    storageLocation: storageDir,
  });

  it('Throws an error if storageLocation is not provided', function test() {
    function createLocalBlobStore(): LocalBlobStorage {
      const config: any = {};

      return new LocalBlobStorage(config);
    }

    assert.throws(createLocalBlobStore, 'storageLocation cannot be empty');
  });

  it('Throws an error if storageLocation is empty', function test() {
    function createLocalBlobStore(): LocalBlobStorage {
      return new LocalBlobStorage({
        storageLocation: '',
      });
    }

    assert.throws(createLocalBlobStore, 'storageLocation cannot be empty');
  });

  describe('Set Item', function upload() {
    afterEach(() => {
      return exec('rm -r ' + storageDir);
    });

    it('Creates the blob item', function test() {
      // Is it creating the file directories?
      return store
        .setItem(uuid.v4() + '.png', picturePath, locationId)
        .then((location: string) => {
          // Check the file exists
          return access(location);
        });
    });

    it('Creates storage location directories if they dont already exist', function test() {
      return assert
        .isRejected(access(storageDir))
        .then(() => {
          return store.setItem(uuid.v4(), picturePath, locationId);
        })
        .then(() => {
          return access(storageDir);
        });
    });
  });

  describe('Delete Item', function deleteItem() {
    let itemKey: string;
    let blobPath: string;

    beforeEach(() => {
      itemKey = uuid.v4() + '.png';

      return store
        .setItem(itemKey, picturePath, locationId)
        .then((location: string) => {
          blobPath = location;
        });
    });

    afterEach(() => {
      return exec('rm -r ' + storageDir);
    });

    it('Deletes the blob item', function test() {
      return store.deleteItem(itemKey, locationId).then(() => {
        return assert.isRejected(access(blobPath));
      });
    });
  });
});
