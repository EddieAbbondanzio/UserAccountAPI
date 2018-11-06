"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Request body for a user that wants to reset
 * their password, and needs a code emailed to
 * them.
 */
class ForgotPasswordPayload {
    /**
     * Create a new forgotten password payload.
     * @param username The username of the user.
     */
    constructor(username) {
        this.username = username;
    }
}
exports.ForgotPasswordPayload = ForgotPasswordPayload;
//# sourceMappingURL=forgotpasswordpayload.js.map