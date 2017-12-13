import {
  BlobStorageClient,
  LocalConfig,
  ModuleConfig,
  S3Config,
} from './definitions';
import { LocalBlobStorage } from './clients/local/index';
import { S3BlobStorage } from './clients/s3/index';

export * from './clients';

export function getBlobStore(config: ModuleConfig): BlobStorageClient {
  config.provider = config.provider.toLowerCase().trim();

  if (config.provider === 'local' && isLocalConfig(config.settings)) {
    const settings: LocalConfig = config.settings as LocalConfig;

    return new LocalBlobStorage(settings);
  } else if (config.provider === 's3' && isS3Config(config.settings)) {
    const settings: S3Config = config.settings as S3Config;

    return new S3BlobStorage(settings);
  }

  throw new Error(
    'invalid config, ensure the provider and providerConfig match'
  );
}

function isLocalConfig(obj: any): obj is LocalConfig {
  return obj.storageLocation !== undefined;
}

function isS3Config(obj: any): obj is S3Config {
  return (
    obj.accessKeyId !== undefined &&
    obj.secretAccessKey !== undefined &&
    obj.region !== undefined
  );
}
