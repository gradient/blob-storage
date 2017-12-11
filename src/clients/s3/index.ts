import * as fs from 'fs';
import * as AWS from 'aws-sdk';
import * as MockAWS from 'mock-aws-s3';
import * as Bluebird from 'bluebird';
import { BaseStorage } from '../base';

AWS.config.setPromisesDependency(Bluebird);

export class S3BlobStorage extends BaseStorage {
  private s3: AWS.S3 | MockAWS.S3;

  constructor(s3: AWS.S3 | MockAWS.S3) {
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
  public setItem(
    key: string,
    filePath: string,
    locationId: string,
    itemType?: string
  ): PromiseLike<any> {
    // locationId is the bucket name
    const bucket: string = locationId;
    const itemKey: string = itemType ? itemType + '/' + key : key;

    // Open a stream to the blob
    const blobStream: fs.ReadStream = fs.createReadStream(filePath, {
      flags: 'r',
      encoding: null,
    });

    const uploadParams: AWS.S3.Types.PutObjectRequest = {
      Bucket: bucket,
      Key: itemKey,
      Body: blobStream,
    };

    // Can't use the AWS `.promise` because MockAWS doesn't support it, so we'll just wrap it up
    return new Bluebird((resolve, reject) => {
      this.s3.upload(
        uploadParams,
        (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.Location);
          }
        }
      );
    });
  }

  /**
   * Deletes a blob form AWS S3
   * @param {string} key - The name of the file
   * @param {string} locationId - The S3 bucket
   * @param {string} itemType - The item type
   * @returns {Promise<any>}
   */
  public deleteItem(
    key: string,
    locationId: string,
    itemType?: string
  ): PromiseLike<any> {
    const itemKey: string = itemType ? itemType + '/' + key : key;

    const deletionParams: AWS.S3.Types.DeleteObjectRequest = {
      Bucket: locationId,
      Key: itemKey,
    };

    // Can't use the AWS `.promise` because MockAWS doesn't support it, so we'll just wrap it up
    return new Bluebird((resolve, reject) => {
      return this.s3.deleteObject(deletionParams, (err: AWS.AWSError) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
