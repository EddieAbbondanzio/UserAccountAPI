/**
 * An invalid operation occurs when something illegal was
 * performed.
 */
export class InvalidOperationError extends Error {
    /**
     * Create a new invalid operation error message.
     * @param message The error message.
     */
    constructor(message: string) {
        super(message);
    }
}