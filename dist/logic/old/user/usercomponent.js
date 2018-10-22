"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logiccomponent_1 = require("../common/logiccomponent");
const userhandler_1 = require("./handlers/userhandler");
const recoveryhandler_1 = require("./handlers/recoveryhandler");
/**
 * Business logic for anything related to users.
 */
class UserComponent extends logiccomponent_1.LogicComponent {
    /**
     * Create a new user component.
     * @param connection The database connection.
     * @param serviceLocator The service locator.
     */
    constructor(connection, serviceLocator) {
        super(connection, serviceLocator);
        this.userHandler = new userhandler_1.UserHandler(connection, serviceLocator);
        this.recoveryHandler = new recoveryhandler_1.RecoveryHandler(connection, serviceLocator);
    }
}
exports.UserComponent = UserComponent;
//# sourceMappingURL=usercomponent.js.map