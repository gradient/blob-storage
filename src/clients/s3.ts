import {BlobItem, BlobStorageClient, GenericObject} from '../../definitions';
import AWS = require('aws-sdk');
import S3 = require('aws-sdk/clients/s3');
import * as config from 'config';
import { itemTypes} from '../item-types';
import * as Bluebird from 'bluebird';

const buckets: GenericObject = config.get('aws.buckets');

AWS.config.setPromisesDependency(Bluebird);

const s3 = new S3({
  credentials: {
    accessKeyId: config.get('aws.aws_access_key_id'),
    secretAccessKey: config.get('aws.aws_secret_access_key'),
  }
});

export class BlobStorageS3 implements BlobStorageClient {
  async getItem(key: string, customerId: string, itemType: string): Promise<any> {
    return getItemS3(key, customerId, itemType);
  }

  async getMultipleItems(items: BlobItem[], attempts?: number): Promise<any> {
    return getMultipleItemS3(items, attempts);
  }

  async setItem(key: string, customerId: string, itemType: string): Promise<any> {
    return setItemS3(key, customerId, itemType);
  }

  async deleteItem(key: string, customerId: string, itemType: string): Promise<any> {
    return deleteItemS3(key, customerId, itemType);
  }
}

async function getItemS3(key: string, customerId: string, itemType: string): Promise<any> {}

async function getMultipleItemS3(items: BlobItem[], attempts?: number): Promise<any> {}

async function setItemS3(key: string, value: ReadableStream, customerId: string, itemType: string): Promise<any> {
  const bucket = buckets[itemType];
  const s3obj = new S3({params: {
    bucket,
    key
  }});

  return s3obj.upload({Body: value})
    .on('httpUploadProgress', function(evt) { console.log(evt); })
    .send(function(err, data) { console.log(err, data) }).promise();
}

async function deleteItemS3(key: string, customerId: string, itemType: string): Promise<any> {}
