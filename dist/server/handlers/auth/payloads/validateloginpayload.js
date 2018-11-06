"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Request body to validate that a user is who they claim
 * they are.
 */
class ValidateLoginPayload {
    /**
     * Create a new validate user login payload.
     * @param username The username to check.
     * @param loginCode The password to check.
     */
    constructor(username, loginCode) {
        this.username = username;
        this.loginCode = loginCode;
    }
}
exports.ValidateLoginPayload = ValidateLoginPayload;
//# sourceMappingURL=validateloginpayload.js.map