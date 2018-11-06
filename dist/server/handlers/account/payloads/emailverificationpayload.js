"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Payload of a Request to verify a User's email.
 */
class EmailVerificationPayload {
    /**
     * Create a new user email verification.
     * @param verificationCode The user's verification code.
     */
    constructor(verificationCode) {
        this.verificationCode = verificationCode;
    }
}
exports.EmailVerificationPayload = EmailVerificationPayload;
//# sourceMappingURL=emailverificationpayload.js.map