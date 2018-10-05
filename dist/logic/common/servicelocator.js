"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zohoemailservice_1 = require("../email/zohoemailservice");
const secret_1 = require("../../secret");
const tokenmanager_1 = require("../authentication/common/tokenmanager");
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
        this.tokenManager = new tokenmanager_1.TokenManager(secret_1.Secret.TOKEN_SECRET_KEY);
    }
}
exports.ServiceLocator = ServiceLocator;

//# sourceMappingURL=servicelocator.js.map
