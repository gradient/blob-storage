"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./clients/local/index");
const index_2 = require("./clients/s3/index");
__export(require("./clients"));
function getBlobStore(config) {
    if (config.provider === 'local' && isLocalConfig(config.settings)) {
        const settings = config.settings;
        return new index_1.LocalBlobStorage(settings);
    }
    else if (config.provider === 's3' && isS3Config(config.settings)) {
        const settings = config.settings;
        return new index_2.S3BlobStorage(settings);
    }
    throw new Error('invalid config, ensure the provider and providerConfig match');
}
exports.getBlobStore = getBlobStore;
function isLocalConfig(obj) {
    return obj.storageLocation !== undefined;
}
function isS3Config(obj) {
    return (obj.accessKeyId !== undefined &&
        obj.secretAccessKey !== undefined &&
        obj.region !== undefined);
}

//# sourceMappingURL=index.js.map
