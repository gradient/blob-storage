"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseStorage {
    getItem(key, locationId, itemType) {
        return Promise.reject(new Error('This function has not been implemented'));
    }
    getMultipleItems(items, attempts) {
        return Promise.reject(new Error('This function has not been implemented'));
    }
    setItem(key, filePath, locationId, itemType) {
        return Promise.reject(new Error('This function has not been implemented'));
    }
    deleteItem(key, locationId, itemType) {
        return Promise.reject(new Error('This function has not been implemented'));
    }
}
exports.BaseStorage = BaseStorage;

//# sourceMappingURL=index.js.map
