"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Request information for a user that wants
 * to reset their password.
 */
class PasswordResetPayload {
    /**
     * Create a new password reset.
     * @param resetCode Their emailed reset code.
     * @param newPassword The password they want to use.
     */
    constructor(resetCode, newPassword) {
        this.resetCode = resetCode;
        this.newPassword = newPassword;
    }
}
exports.PasswordResetPayload = PasswordResetPayload;
//# sourceMappingURL=passwordresetpayload.js.map