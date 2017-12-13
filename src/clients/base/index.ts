import { BlobItem, BlobStorageClient } from '../../definitions';

export class BaseStorage implements BlobStorageClient {
  public getItem(
    key: string,
    locationId: string,
    itemType?: string
  ): PromiseLike<any> {
    return Promise.reject(new Error('This function has not been implemented'));
  }

  public getMultipleItems(items: BlobItem[], attempts?: number): Promise<any> {
    return Promise.reject(new Error('This function has not been implemented'));
  }

  public setItem(
    key: string,
    filePath: string,
    locationId: string,
    itemType?: string
  ): PromiseLike<any> {
    return Promise.reject(new Error('This function has not been implemented'));
  }

  public deleteItem(
    key: string,
    locationId: string,
    itemType?: string
  ): PromiseLike<any> {
    return Promise.reject(new Error('This function has not been implemented'));
  }
}
