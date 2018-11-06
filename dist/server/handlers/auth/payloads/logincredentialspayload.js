"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Request body to log in a user.
 */
class LoginCredentialsPayload {
    /**
     * Create a new set of user login credentials.
     * @param username The username to log in with.
     * @param password The password to use.
     */
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}
exports.LoginCredentialsPayload = LoginCredentialsPayload;
//# sourceMappingURL=logincredentialspayload.js.map