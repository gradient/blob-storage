import * as path from 'path';
import * as uuid from 'uuid';
import { exec as execCb } from 'child_process';
import * as Bluebird from 'bluebird';
import * as MockAWS from 'mock-aws-s3';
import { S3BlobStorage } from '../../src/clients/';

const exec = Bluebird.promisify(execCb);

describe('S3 Blob Storage', function s3BlobStorageTests() {
  const basePath: string = path.join(__dirname, '../tmp');
  const locationId: string = 's3-blob-test';
  const blobPath: string = path.join(__dirname, '../fixtures/img.png');

  MockAWS.config.basePath = basePath;
  const mockS3 = new MockAWS.S3();

  const store: S3BlobStorage = new S3BlobStorage(mockS3);

  describe('Set Item', function upload() {
    afterEach(() => {
      return exec('rm -r ' + basePath);
    });

    it('Creates the blob item', function test() {
      return store.setItem(uuid.v4() + '.png', blobPath, locationId);
    });
  });

  describe('Delete Item', function deleteItem() {
    let itemKey: string;

    beforeEach(() => {
      itemKey = uuid.v4() + '.png';

      return store.setItem(itemKey, blobPath, locationId);
    });

    afterEach(() => {
      return exec('rm -r ' + basePath);
    });

    it('Deletes the blob item', function test() {
      return store.deleteItem(itemKey, locationId);
    });
  });
});
