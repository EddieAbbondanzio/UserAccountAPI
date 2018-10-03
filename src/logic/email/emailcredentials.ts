
/**
 * Credentials for logging into the email proivder.
 * Don't change the name of the properties as these
 * line up with NodeMailer.
 */
export class EmailCredentials {
    /**
     * The username to log in under.
     */
    public user: string;

    /**
     * The password to use.
     */
    public pass: string;

    /**
     * Create a new set of email credentials.
     * @param username The email account.
     * @param password The password to use.
     */
    constructor(username: string, password: string) {
        this.user = username;
        this.pass = password;
    }
}