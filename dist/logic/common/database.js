"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The data persistance container. This should be able to store and retrieve
 * models that are stored in it at any time.
 */
class Database {
    /**
     * Create a new database.
     */
    constructor() {
        Database.current = this;
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map