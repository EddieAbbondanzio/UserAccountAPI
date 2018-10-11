
/**
 * Interface for task result objects to implement. These
 * should be wrappers that allow for returning error messages
 * or success indicators without having to throw errors.
 */
export interface ITaskResult {
    /**
     * If the task completed without an error.
     */
    success: boolean;

    /**
     * Error messages of any errors that occcured.
     */
    errors: string[];
}