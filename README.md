# Blob Storage
[![CircleCI](https://circleci.com/gh/gradient/blob-storage/tree/master.svg?style=shield&circle-token=eeaf66f4575bde4786f48539d8c8e2a8b0b3cf75)](https://circleci.com/gh/gradient/blob-storage/tree/master)

> Blob storage at your finger tips

Blob storage can be awkward to orchestrate, especially when you need to switch out providers for your project on demand. Blob storage makes this easier, it comes pre-bundled with a number of pre-configured providers. Blob storage is opinionated and designed to work with minimal fuss and configuration.

## Installation

### NPM

```sh
$ npm i @gradient/blob-storage --save
```

### Yarn

```sh
$ yarn add @gradient/blob-storage --save
```

## Usage

Blob Storage currently supports the following clients:

* Local storage (a disk volume your process has access to)
* AWS S3

For implementation details of each client see the [Specific clients section](#specific-clients).

### Initialisation

Initialising a local blob storage object:

```js
const getBlobStore = require('@gradient/blob-storage');

const options = {
    provider: 'local',
    settings: {
        storageLocation: path.join(__dirname, '/tmp')
    }
};

const store = getBlobStore(options);
```

Initialising an S3 blob storage object:

```js
const getBlobStore = require('@gradient/blob-storage');

const options = {
    provider: 's3',
    settings: {
        accessKeyId: 'your-iam-access-key',
        secretAccessKey: 'your-iam-secret-access-key'
    }
};

const store = getBlobStore(options);
```

### Using the blob store

All blob storage clients meet the same interface, however some clients may not have implemented all the functions if they are irrelevant. The functions provided by the clients are:

#### getItem(key, locationId, itemType)

Gets an existing item.

* key - is the blob identifier.
* locationId - corresponds to some location identifier on the particular provider, for the local client this is a sub directory, for s3 this is a bucket, etc.
* itemType (optional) - is another way to divide up the storage of your blobs. For instance, you may wish to separate user "avatars" which are images, from "podcast-episodes" which are sound files.

The return value is dependant on the implementation, usually it is a buffer of the file of something similar.

#### getMultipleItems(items, attempts)

Gets multiple existing items.

* items - An array of objects with the attributes `key`, `locationId`, and `itemType` for the same purposes as the `getItem` function.
* attempts (optional) - This is the number of attempts the client should make should it fail to get any item. By default this is usually 1, but will depend on the clients implementation.

The return value is dependant on the clients implementation, usually this is an array of file buffers or similar.

#### setItem(key, filePath, locationId, itemType)

Sets a new or existing item to a new blob (if this is a service based provider such as S3, this will upload the file).

* key - is the blob name that it will be stored with and will be used to help identify it via other functions. This often corresponds to a file name on the particular system.
* filePath - the full path to the file you wish to set (upload)
* locationId - corresponds to some location identifier on the particular provider, for the local client this is a sub directory, for s3 this is a bucket, etc.
* itemType (optional) - is another way to divide up the storage of your blobs. For instance, you may wish to separate user "avatars" which are images, from "podcast-episodes" which are sound files.

The return value is dependant on the clients implementation, usually this is a full URL or path to the blob.

#### deleteItem(key, locationId, itemType)

Deletes the item from the blob store.

* key - is the blob identifier.
* locationId - corresponds to some location identifier on the particular provider, for the local client this is a sub directory, for s3 this is a bucket, etc.
* itemType (optional) - is another way to divide up the storage of your blobs. For instance, you may wish to separate user "avatars" which are images, from "podcast-episodes" which are sound files.

This often returns void, but this will depend on the clients implementation.

### Specific clients

#### Local

Local storage makes use of an accessible local storage that the process has access to.

Only setItem and deleteItem have been implemented for this as setItem will return the full file path to the item.

#### AWS S3

Uses AWS's S3 (Simple Storage Solution) to store blobs.

Only setItem and deleteItem have been implemented for this as setItem will return the S3 location (a url) of the item for reading.

## Contributions

We welcome contributions, if you'd like to create a new client implementation or complete an existing one, please submit a GitHub Pull Request. Please ensure you've written tests to check your changes.

We use yarn for this project, please ensure new packages are added using yarn so that it updates the `yarn.lock` file.

To run the tests, simply use `yarn test`!

To generate a build, run `yarn build`.

## Licence

[MIT](./LICENSE.md) @ [Gradient Limited](https://gradient.co/)

## Code of conduct

Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to abide by its terms.