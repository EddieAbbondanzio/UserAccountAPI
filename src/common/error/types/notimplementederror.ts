
/**
 * Error for when a method or function is not yet
 * implemented.
 */
export class NotImplementedError extends Error {
    /**
     * Create a new not implemented error.
     * @param message The error message.
     */
    constructor(message?: string) {
        super(message);
    }
}