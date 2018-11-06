"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Request body to update a password of a user. This requires
 * their current username, and the new password they want to use.
 */
class PasswordUpdatePayload {
    /**
     * Create a new user password update.
     * @param currPassword The current password of the user.
     * @param newPassword The password the user wants to update to.
     */
    constructor(currPassword, newPassword) {
        this.currentPassword = currPassword;
        this.newPassword = newPassword;
    }
}
exports.PasswordUpdatePayload = PasswordUpdatePayload;
//# sourceMappingURL=passwordupdatepayload.js.map