
/**
 * Error for when an entity violates a unique constraint
 * of a database table.
 */
export class DuplicateEntityError extends Error {
    /**
     * Create a new error.
     * @param message The error message.
     */
    constructor(message: string){
        super(message);
    }
}