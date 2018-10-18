"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailcredentials_1 = require("../logic/services/email/emailcredentials");
const databaseconfig_1 = require("./databaseconfig");
/**
 * Configuration settings for the app. This contains the
 * database credentials, JWT key, and more.
 */
class Config {
    constructor() {
        this.emailCredentials = new emailcredentials_1.EmailCredentials();
        this.databaseConfig = new databaseconfig_1.DatabaseConfig();
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map