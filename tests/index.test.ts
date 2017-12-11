import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { BlobStorageClient, ModuleConfig } from '../src/definitions';
import { LocalBlobStorage, S3BlobStorage, getBlobStore } from '../src';

chai.use(chaiAsPromised);
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

    it('Throws an error if storageLocation is not provided', function test() {
      function createBlobStorageClient() {
        const config: any = {
          provider: 'local',
          settings: {},
        };

        const store: BlobStorageClient = getBlobStore(config);
      }

      assert.throws(
        createBlobStorageClient,
        'invalid config, ensure the provider and providerConfig match'
      );
    });

    it('Throws an error if storageLocation is an empty string', function test() {
      function createBlobStorageClient() {
        const config: any = {
          provider: 'local',
          settings: {
            storageLocation: '',
          },
        };

        const store: BlobStorageClient = getBlobStore(config);
      }

      assert.throws(createBlobStorageClient, 'storageLocation cannot be empty');
    });

    describe('Provider is s3', function providerIsS3Tests() {
      it('Returns an S3BlobStorage', function test() {
        const config: ModuleConfig = {
          provider: 's3',
          settings: {
            accessKeyId: '1234',
            secretAccessKey: 'abcd',
          },
        };

        const store: BlobStorageClient = getBlobStore(config);

        assert.instanceOf(store, S3BlobStorage);
      });

      it('Throws an error if accessKeyId is not provided', function test() {
        function createBlobStorageClient() {
          const config: any = {
            provider: 's3',
            settings: {
              secretAccessKey: 'abcd',
            },
          };

          const store: BlobStorageClient = getBlobStore(config);
        }

        assert.throws(
          createBlobStorageClient,
          'invalid config, ensure the provider and providerConfig match'
        );
      });

      it('Throws an error if secretAccessKey is an empty string', function test() {
        function createBlobStorageClient() {
          const config: any = {
            provider: 's3',
            settings: {
              accessKeyId: '1234',
            },
          };

          const store: BlobStorageClient = getBlobStore(config);
        }

        assert.throws(
          createBlobStorageClient,
          'invalid config, ensure the provider and providerConfig match'
        );
      });

      it('Throws an error if accessKeyId is an empty string', function test() {
        function createBlobStorageClient() {
          const config: ModuleConfig = {
            provider: 's3',
            settings: {
              accessKeyId: '',
              secretAccessKey: 'abcd',
            },
          };

          const store: BlobStorageClient = getBlobStore(config);
        }

        assert.throws(
          createBlobStorageClient,
          'accessKeyId and secretAccessKey cannot be empty'
        );
      });

      it('Throws an error if secretAccessKey is an empty string', function test() {
        function createBlobStorageClient() {
          const config: ModuleConfig = {
            provider: 's3',
            settings: {
              accessKeyId: '1234',
              secretAccessKey: '',
            },
          };

          const store: BlobStorageClient = getBlobStore(config);
        }

        assert.throws(
          createBlobStorageClient,
          'accessKeyId and secretAccessKey cannot be empty'
        );
      });
    });
  });
});
