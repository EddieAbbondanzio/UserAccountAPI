
/**
 * Error for when an entity violates a unique constraint
 * of a database table.
 */
export class DuplicateError extends Error {
    /**
     * Create a new error.
     * @param message The error message.
     */
    constructor(message: string){
        super(message);
    }
}