
/**
 * Request body to validate that a user is who they claim
 * they are.
 */
export class ValidateLoginPayload {
    /**
     * The username to validate.
     */
    public username: string;

    /**
     * Their login code.
     */
    public loginCode: string;

    /**
     * Create a new validate user login payload.
     * @param username The username to check.
     * @param loginCode The password to check.
     */
    constructor(username?: string, loginCode?: string) {
        this.username  = username;
        this.loginCode = loginCode;
    }
}