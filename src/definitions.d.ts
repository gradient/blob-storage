export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
}

export interface LocalConfig {
  storageLocation: string;
}

export interface BlobItem {
  key: string;
  customerId: string;
  itemType?: string;
}

export interface BlobStorageClient {
  /**
   * Takes a key and optional type and retrieves the item from the blob store
   * restrictions by customer.
   * @param {string} key: The identifier for the item
   * @param {string} customerId: The item type, this allows the implementation to make decisions for certain
   * types of item
   * @param {string} itemType: The customer_id, this allows the implementation to make decisions using namespace
   * @returns {any}
   */
  getItem: (key: string, locationId: string, itemType?: string) => any;

  /**
   * Takes an array of blob items and retrieves them from storage.
   * attempts is an optional parameter that signifies the number of retries.
   * @param {BlobItem[]} items
   * @param {number} attempts
   * @returns {any}
   */
  getMultipleItems: (items: BlobItem[], attempts?: number) => any;

  /**
   * Takes a key, value and optional type - store the item in the blog store
   * @param {string} key: The identifier for the item
   * @param {string} value: The data to be stored
   * @param {string} customerId: The customer identifier, this allows the implementation to make decisions using
   * namespace restrictions by customer.
   * @param {string} itemType: The item type, this allows the implementation to make decisions for certain types of item
   * @returns {any}
   */
  setItem: (
    key: string,
    filePath: string,
    locationId: string,
    itemType?: string
  ) => any;

  /**
   * Takes a key and optional type. Deletes the matching item from the blob store
   * @param {string} key: The identifier for the item
   * @param {string} customerId: The item type, this allows the implementation to make decisions for certain types of
   * item
   * @param {string} itemType: The customerId, this allows the implementation to make decisions using namespace
   * restrictions by customer.
   * @returns {any}
   */
  deleteItem: (key: string, locationId: string, itemType?: string) => any;
}

export interface ModuleConfig {
  provider: string;
  settings: S3Config | LocalConfig;
}

export function getBlobStore(config: ModuleConfig): BlobStorageClient;
