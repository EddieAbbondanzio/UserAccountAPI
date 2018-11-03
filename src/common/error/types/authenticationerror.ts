
/**
 * An error for a failed credentials attempt.
 */
export class AuthenticationError extends Error {
    /**
     * Create a new authentication error.
     * @param message The message of the error.
     */
    constructor(message: string){
        super(message);
    }
}