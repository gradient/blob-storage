import * as chai from 'chai';
import { BlobStorageClient, ModuleConfig } from '../src/definitions';
import { getBlobStore } from '../src/index';
import { LocalBlobStorage, S3BlobStorage } from '../src';

const assert = chai.assert;

describe('Blob Storage Tests', function blobStorageTests() {
  describe('getBlobStore', function getBlobStoreTests() {
    it('Returns a LocalBlobStorage when provider is local', function test() {
      const config: ModuleConfig = {
        provider: 'local',
        settings: {
          storageLocation: '/tmp',
        },
      };

      const store: BlobStorageClient = getBlobStore(config);

      assert.instanceOf(store, LocalBlobStorage);
    });

    it('Returns an S3BlobStorage when provider is s3', function test() {
      const config: ModuleConfig = {
        provider: 's3',
        settings: {
          accessKeyId: '1234',
          secretAccessKey: 'abcd',
          region: 'eu-west-1',
        },
      };

      const store: BlobStorageClient = getBlobStore(config);

      assert.instanceOf(store, S3BlobStorage);
    });
  });
});
