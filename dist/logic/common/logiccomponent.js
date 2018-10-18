"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class for any service that works off the database.
 * A cache of the connection is kept and can be accessed
 * via this.connection.
 */
class LogicComponent {
    /**
     * Create a new service to the db.
     * @param connection The connection to cache.
     * @param serviceLocator The service locator.
     */
    constructor(connection, serviceLocator) {
        this.connection = connection;
        this.serviceLocator = serviceLocator;
    }
}
exports.LogicComponent = LogicComponent;
//# sourceMappingURL=logiccomponent.js.map