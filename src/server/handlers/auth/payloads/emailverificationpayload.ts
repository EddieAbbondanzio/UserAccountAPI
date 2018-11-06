
/**
 * Payload of a Request to verify a User's email.
 */
export class EmailVerificationPayload {
    /**
     * The verification code that the user was emailed.
     */
    public verificationCode: string;

    /**
     * Create a new user email verification.
     * @param verificationCode The user's verification code.
     */
    constructor(verificationCode: string) {
        this.verificationCode = verificationCode;
    }
}