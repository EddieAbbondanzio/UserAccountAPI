
/**
 * Request information for a user that wants
 * to reset their password. 
 */
export class PasswordResetPayload {
    /**
     * The reset code that they were emailed.
     */
    public resetCode: string;

    /**
     * The new password they want to switch to.
     */
    public newPassword: string;

    /**
     * Create a new password reset.
     * @param resetCode Their emailed reset code.
     * @param newPassword The password they want to use.
     */
    constructor(resetCode?: string, newPassword?: string) {
        this.resetCode   = resetCode;
        this.newPassword = newPassword;
    }
}