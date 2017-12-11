"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const AWS = require("aws-sdk");
const Bluebird = require("bluebird");
const base_1 = require("../base");
AWS.config.setPromisesDependency(Bluebird);
class S3BlobStorage extends base_1.BaseStorage {
    constructor(s3) {
        super();
        this.s3 = s3;
    }
    /**
     * Uploads a blob to AWS S3
     * @param {string} key - Name of the file
     * @param {string} filePath - Full file path
     * @param {string} locationId - The S3 bucket.
     * @param {string} itemType - Type of item being uploaded
     * @returns {Promise<any>}
     */
    setItem(key, filePath, locationId, itemType) {
        // locationId is the bucket name
        const bucket = locationId;
        const itemKey = itemType ? itemType + '/' + key : key;
        // Open a stream to the blob
        const blobStream = fs.createReadStream(filePath, {
            flags: 'r',
            encoding: null,
        });
        const uploadParams = {
            Bucket: bucket,
            Key: itemKey,
            Body: blobStream,
        };
        // Can't use the AWS `.promise` because MockAWS doesn't support it, so we'll just wrap it up
        return new Bluebird((resolve, reject) => {
            this.s3.upload(uploadParams, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data.Location);
                }
            });
        });
    }
    /**
     * Deletes a blob form AWS S3
     * @param {string} key - The name of the file
     * @param {string} locationId - The S3 bucket
     * @param {string} itemType - The item type
     * @returns {Promise<any>}
     */
    deleteItem(key, locationId, itemType) {
        const itemKey = itemType ? itemType + '/' + key : key;
        const deletionParams = {
            Bucket: locationId,
            Key: itemKey,
        };
        // Can't use the AWS `.promise` because MockAWS doesn't support it, so we'll just wrap it up
        return new Bluebird((resolve, reject) => {
            return this.s3.deleteObject(deletionParams, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
}
exports.S3BlobStorage = S3BlobStorage;

//# sourceMappingURL=index.js.map
