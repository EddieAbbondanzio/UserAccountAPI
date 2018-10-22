"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Credentials for logging into the email proivder.
 * Don't change the name of the properties as these
 * line up with NodeMailer.
 */
class EmailCredentials {
    /**
     * Create a new set of email credentials.
     * @param username The email account.
     * @param password The password to use.
     */
    constructor(username, password) {
        this.user = username;
        this.pass = password;
    }
}
exports.EmailCredentials = EmailCredentials;
//# sourceMappingURL=emailcredentials.js.map