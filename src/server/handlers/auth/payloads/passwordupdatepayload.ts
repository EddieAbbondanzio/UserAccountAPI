
/**
 * Request body to update a password of a user. This requires
 * their current username, and the new password they want to use.
 */
export class PasswordUpdatePayload {
    /**
     * Their current password.
     */
    public currentPassword: string;

    /**
     * Their desired new password.
     */
    public newPassword: string;

    /**
     * Create a new user password update.
     * @param currPassword The current password of the user.
     * @param newPassword The password the user wants to update to.
     */
    constructor(currPassword?: string, newPassword?: string) {
        this.currentPassword = currPassword;
        this.newPassword     = newPassword;
    }
}