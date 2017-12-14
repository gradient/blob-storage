import * as AWS from 'aws-sdk';
import {
  BlobStorageClient,
  LocalConfig,
  ModuleConfig,
  S3Config,
} from './definitions';
import { LocalBlobStorage } from './clients/local';
import { S3BlobStorage } from './clients/s3';

export * from './clients';

export function getBlobStore(config: ModuleConfig): BlobStorageClient {
  const provider = config.provider.toLowerCase().trim();

  if (provider === 'local' && isLocalConfig(config.settings)) {
    const settings: LocalConfig = config.settings as LocalConfig;

    if (!settings.storageLocation) {
      throw new Error('storageLocation cannot be empty');
    }

    return new LocalBlobStorage(settings);
  } else if (provider === 's3' && isS3Config(config.settings)) {
    const settings: S3Config = config.settings as S3Config;

    if (!settings.accessKeyId || !settings.secretAccessKey) {
      throw new Error('accessKeyId and secretAccessKey cannot be empty');
    }

    const s3 = new AWS.S3({
      accessKeyId: settings.accessKeyId,
      secretAccessKey: settings.secretAccessKey,
    });

    return new S3BlobStorage(s3);
  }

  throw new Error(
    'invalid config, ensure the provider and providerConfig match'
  );
}

function isLocalConfig(obj: any): obj is LocalConfig {
  return obj.storageLocation !== undefined;
}

function isS3Config(obj: any): obj is S3Config {
  return obj.accessKeyId !== undefined && obj.secretAccessKey !== undefined;
}
