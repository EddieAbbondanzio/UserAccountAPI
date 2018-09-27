"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class for any service that works off the database.
 * A cache of the connection is kept and can be accessed
 * via this.connection.
 */
class Service {
    /**
     * Create a new service to the db.
     * @param connection The connection to cache.
     */
    constructor(connection) {
        this.connection = connection;
    }
}
exports.Service = Service;

//# sourceMappingURL=service.js.map
