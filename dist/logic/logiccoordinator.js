"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticationcomponent_1 = require("./authentication/authenticationcomponent");
const usercomponent_1 = require("./user/usercomponent");
/**
 * Handles managing the business logic layer.
 */
class LogicCoordinator {
    /**
     * Create a new logic coordinator for handling the
     * business logic layer.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(connection, serviceLocator) {
        this.serviceLocator = serviceLocator;
        this.authenticationComponent = new authenticationcomponent_1.AuthenticationComponent(connection, serviceLocator);
        this.userComponent = new usercomponent_1.UserComponent(connection, serviceLocator);
    }
}
exports.LogicCoordinator = LogicCoordinator;

//# sourceMappingURL=logiccoordinator.js.map
