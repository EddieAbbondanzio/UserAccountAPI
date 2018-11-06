
/**
 * Request body for a user that wants to reset
 * their password, and needs a code emailed to
 * them.
 */
export class ForgotPasswordPayload {
    /**
     * The username of the user to send a reset code.
     */
    public username: string;

    /**
     * Create a new forgotten password payload.
     * @param username The username of the user.
     */
    constructor(username?: string) {
        this.username = username;
    }
}