import { ITaskResult } from "./itaskresult";

/**
 * A task result that doesn't have any value to return back.
 */
export class VoidTaskResult implements ITaskResult {

    /**
     * If the task completed without an error.
     */
    public success: boolean;

    /**
     * The error messages of any errors that occured.
     */
    public errors: string[];

    /**
     * Create a new void task result.
     * @param success The success flag.
     * @param errors Any error messages.
     */
    constructor(success: boolean, ...errors: string[]){
        this.success = success;
        this.errors  = errors;
    }

    /**
     * Create a new successful result.
     * @param value The value to return.
     * @returns The newly created result.
     */
    public static successResult(): VoidTaskResult {
        return new VoidTaskResult(true);
    }

    /**
     * Create a new error based result.
     * @param errors The error messsages of errors that occured.
     * @returns The newly created error result.
     */
    public static errorResult(...errors: string[]): VoidTaskResult {
        return new VoidTaskResult(false, ...errors);
    }
}