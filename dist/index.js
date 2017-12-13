"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const local_1 = require("./clients/local");
const s3_1 = require("./clients/s3");
__export(require("./clients"));
function getBlobStore(config) {
    config.provider = config.provider.toLowerCase().trim();
    if (config.provider === 'local' && isLocalConfig(config.settings)) {
        const settings = config.settings;
        if (!settings.storageLocation) {
            throw new Error('storageLocation cannot be empty');
        }
        return new local_1.LocalBlobStorage(settings);
    }
    else if (config.provider === 's3' && isS3Config(config.settings)) {
        const settings = config.settings;
        if (!settings.accessKeyId || !settings.secretAccessKey) {
            throw new Error('accessKeyId and secretAccessKey cannot be empty');
        }
        const s3 = new AWS.S3({
            accessKeyId: settings.accessKeyId,
            secretAccessKey: settings.secretAccessKey,
        });
        return new s3_1.S3BlobStorage(s3);
    }
    throw new Error('invalid config, ensure the provider and providerConfig match');
}
exports.getBlobStore = getBlobStore;
function isLocalConfig(obj) {
    return obj.storageLocation !== undefined;
}
function isS3Config(obj) {
    return obj.accessKeyId !== undefined && obj.secretAccessKey !== undefined;
}

//# sourceMappingURL=index.js.map
