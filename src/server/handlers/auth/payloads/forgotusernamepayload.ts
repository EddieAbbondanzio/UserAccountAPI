
/**
 * Body of a request for a user that wants to have their username
 * emailed to them.
 */
export class ForgotUsernamePayload {
    /**
     * The email of the user that wants to have their
     * username sent to them.
     */
    public email: string;

    /**
     * Create a new forgotten username payload.
     * @param email The user's email.
     */
    constructor(email?: string) {
        this.email = email;
    }
}