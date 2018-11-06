
/**
 * Request body to log in a user.
 */
export class LoginCredentialsPayload {
    /**
     * The user's username.
     */
    public username: string;

    /**
     * The user's password.
     */
    public password: string;

    /**
     * Create a new set of user login credentials.
     * @param username The username to log in with.
     * @param password The password to use.
     */
    constructor(username?: string, password?: string) {
        this.username = username;
        this.password = password;
    }
}