"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class for Business logic classes to derive
 * from.
 */
class LogicHandler {
    /**
     * Create a new instance of a BLL.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(serviceLocator) {
        this.serviceLocator = serviceLocator;
    }
}
exports.LogicHandler = LogicHandler;
//# sourceMappingURL=logichandler.js.map