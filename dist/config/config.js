"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const databaseconfig_1 = require("./databaseconfig");
const emailcredentials_1 = require("../logic/email/emailcredentials");
/**
 * Configuration settings for the app. This contains the
 * database credentials, JWT key, and more.
 */
class Config {
    /**
     * Create a new config setup.
     */
    constructor() {
        if (Config.current) {
            throw new Error('A config already exists?');
        }
        Config.current = this;
        this.emailCredentials = new emailcredentials_1.EmailCredentials();
        this.database = new databaseconfig_1.DatabaseConfig();
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map