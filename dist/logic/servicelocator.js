"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userservice_1 = require("./user/userservice");
const authenticationservice_1 = require("./security/authenticationservice");
/**
 * Service locator for providing the dependencies
 * that the server relies on. This is dependecy
 * inversion in action.
 */
class ServiceLocator {
    /**
     * Create a new service locator.
     * @param dbConnection The connection to the database.
     */
    constructor(dbConnection) {
        this.userService = new userservice_1.UserService(dbConnection);
        this.authService = new authenticationservice_1.AuthenticationService(dbConnection);
    }
}
exports.ServiceLocator = ServiceLocator;

//# sourceMappingURL=servicelocator.js.map
