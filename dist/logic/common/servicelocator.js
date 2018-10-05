"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userservice_1 = require("../user/userservice");
const authservice_1 = require("../security/authservice");
const zohoemailservice_1 = require("../email/zohoemailservice");
const secret_1 = require("../../secret");
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
        this.emailService = new zohoemailservice_1.ZohoEmailService(secret_1.Secret.EMAIL_CREDENTIALS);
        this.userService = new userservice_1.UserService(dbConnection, this.emailService);
        this.authService = new authservice_1.AuthService(dbConnection, this.emailService, secret_1.Secret.TOKEN_SECRET_KEY);
    }
}
exports.ServiceLocator = ServiceLocator;

//# sourceMappingURL=servicelocator.js.map
