"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The data access layer for managing interactions
 * with the data persistance system.
 */
class DataAccessLayer {
    constructor() {
        if (DataAccessLayer.current) {
            throw new Error('A data access layer already exists!');
        }
        DataAccessLayer.current = this;
    }
}
exports.DataAccessLayer = DataAccessLayer;
//# sourceMappingURL=dataaccesslayer.js.map