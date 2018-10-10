import { ValidatorResult } from "./validatorresult";

/**
 * Interface for validators to implement. They provide a way
 * to check objects to ensure good data.
 */
export interface IValidator<T> {
    /**
     * Validate an object against the validator to see if 
     * everything is valid.
     * @param instance The object to validate.
     * @param errors The growing list of errors.
     */
    validate(instance: T): ValidatorResult;
}