"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Body of a request for a user that wants to have their username
 * emailed to them.
 */
class ForgotUsernamePayload {
    /**
     * Create a new forgotten username payload.
     * @param email The user's email.
     */
    constructor(email) {
        this.email = email;
    }
}
exports.ForgotUsernamePayload = ForgotUsernamePayload;
//# sourceMappingURL=forgotusernamepayload.js.map