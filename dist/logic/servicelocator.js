"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zohoemailservice_1 = require("./services/email/zohoemailservice");
const tokenmanager_1 = require("./authentication/common/tokenmanager");
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
        this.emailService = new zohoemailservice_1.ZohoEmailService(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);
        this.tokenManager = new tokenmanager_1.TokenManager(process.env.TOKEN_SECRET_KEY);
    }
}
exports.ServiceLocator = ServiceLocator;

//# sourceMappingURL=servicelocator.js.map
