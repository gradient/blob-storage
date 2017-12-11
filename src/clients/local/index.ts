import * as path from 'path';
import {
  copyFile as copyFileCb,
  unlink,
  access as accessCb,
  constants,
  PathLike,
} from 'fs';
import * as mkdirpCb from 'mkdirp';
import * as Bluebird from 'bluebird';
import { BaseStorage } from '../base';
import { LocalConfig } from '../../definitions';

const access = <(
  path: PathLike,
  mode: number | undefined
) => Bluebird<void>>Bluebird.promisify(accessCb);
const mkdirp = Bluebird.promisify(mkdirpCb);
const copyFile = Bluebird.promisify(copyFileCb);
const deleteFile = Bluebird.promisify(unlink);

export class LocalBlobStorage extends BaseStorage {
  private storageLocation: string;

  constructor(config: LocalConfig) {
    super();

    if (!config.storageLocation) {
      throw new Error('storageLocation cannot be empty');
    }

    this.storageLocation = config.storageLocation;
  }

  public setItem(
    key: string,
    filePath: string,
    locationId: string,
    itemType?: string
  ): PromiseLike<string> {
    let destinationDir: string = path.join(this.storageLocation, locationId);

    if (itemType) {
      destinationDir = path.join(destinationDir, itemType);
    }

    let destination: string = path.join(destinationDir, key);

    return createDirIfItDoesntExist(destinationDir)
      .then(() => {
        return copyFile(filePath, destination);
      })
      .then(() => {
        return destination;
      })
      .catch((err: NodeJS.ErrnoException) => {
        if (err.code === 'ENOENT') {
          throw new Error('File does not exist or user does not have access');
        } else {
          throw new Error(
            'Failed to set item, does it exist and does this process have access to the file?'
          );
        }
      });
  }

  public deleteItem(
    key: string,
    locationId: string,
    itemType?: string
  ): PromiseLike<void> {
    let filePath: string;
    if (itemType) {
      filePath = path.join(this.storageLocation, locationId, itemType, key);
    } else {
      filePath = path.join(this.storageLocation, locationId, key);
    }

    return deleteFile(filePath)
      .then(() => {
        Bluebird.resolve();
      })
      .catch((err: NodeJS.ErrnoException) => {
        throw new Error('Failed to delete item');
      });
  }
}

function createDirIfItDoesntExist(dir: string) {
  return access(dir, constants.W_OK)
    .then(() => {
      return Bluebird.resolve();
    })
    .catch((err: NodeJS.ErrnoException) => {
      return mkdirp(dir);
    });
}
