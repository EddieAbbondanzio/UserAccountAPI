import { ITaskResult } from "./itaskresult";

/**
 * A task result that has a value to return. Note
 * a success flag of true should not be considered 
 * an indicator if the value being returned is not null.
 */
export class TaskResult<T> implements ITaskResult {
    /**
     * If the task completed successfully.
     */
    public success: boolean;

    /**
     * The value beign returned.
     */
    public value: T;

    /**
     * The error messages of any errors that occured.
     */
    public errors: string[];

    /**
     * Create a new task result.
     * @param success The success flag.
     * @param value The value being returned.
     * @param errors The error messages of any errors that occured.
     */
    constructor(success: boolean, value: T, ...errors: string[]){
        this.success = success;
        this.value   = value;
        this.errors  = errors;
    }

    /**
     * Create a new successful result.
     * @param value The value to return.
     * @returns The newly created result.
     */
    public static successResult<T>(value: T): TaskResult<T> {
        return new TaskResult(true, value);
    }

    /**
     * Create a new error based result.
     * @param errors The error messsages of errors that occured.
     * @returns The newly created error result.
     */
    public static errorResult<T>(...errors: string[]): TaskResult<T> {
        return new TaskResult(false, null, ...errors);
    }
}