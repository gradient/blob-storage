"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_1 = require("fs");
const mkdirpCb = require("mkdirp");
const Bluebird = require("bluebird");
const base_1 = require("../base");
const access = Bluebird.promisify(fs_1.access);
const mkdirp = Bluebird.promisify(mkdirpCb);
const copyFile = Bluebird.promisify(fs_1.copyFile);
const deleteFile = Bluebird.promisify(fs_1.unlink);
class LocalBlobStorage extends base_1.BaseStorage {
    constructor(config) {
        super();
        if (!config.storageLocation) {
            throw new Error('storageLocation cannot be empty');
        }
        this.storageLocation = config.storageLocation;
    }
    setItem(key, filePath, locationId, itemType) {
        let destinationDir = path.join(this.storageLocation, locationId);
        if (itemType) {
            destinationDir = path.join(destinationDir, itemType);
        }
        let destination = path.join(destinationDir, key);
        return createDirIfItDoesntExist(destinationDir)
            .then(() => {
            return copyFile(filePath, destination);
        })
            .then(() => {
            return destination;
        })
            .catch((err) => {
            if (err.code === 'ENOENT') {
                throw new Error('File does not exist or user does not have access');
            }
            else {
                throw new Error('Failed to set item, does it exist and does this process have access to the file?');
            }
        });
    }
    deleteItem(key, locationId, itemType) {
        let filePath;
        if (itemType) {
            filePath = path.join(this.storageLocation, locationId, itemType, key);
        }
        else {
            filePath = path.join(this.storageLocation, locationId, key);
        }
        return deleteFile(filePath)
            .then(() => {
            Bluebird.resolve();
        })
            .catch((err) => {
            throw new Error('Failed to delete item');
        });
    }
}
exports.LocalBlobStorage = LocalBlobStorage;
function createDirIfItDoesntExist(dir) {
    return access(dir, fs_1.constants.W_OK)
        .then(() => {
        return Bluebird.resolve();
    })
        .catch((err) => {
        return mkdirp(dir);
    });
}

//# sourceMappingURL=index.js.map
