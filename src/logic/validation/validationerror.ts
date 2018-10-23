import { ValidatorResult } from "./validatorresult";

/**
 * Custom error to handle a bad validation result.
 */
export class ValidationError extends Error {
    /**
     * The result that the validator spit out.
     */
    public validatorResult: ValidatorResult;

    /**
     * Create a new custom error for validators that fail.
     * @param message Summary of the issue.
     * @param validatorResult The validator's output.
     */
    constructor(message: string, validatorResult?: ValidatorResult){
        super(message);
        this.validatorResult = validatorResult;
    }
}