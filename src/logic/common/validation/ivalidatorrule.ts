import { ValidatorRuleResult } from "./validatorruleresult";

/**
 * A validaiton rule is some kind of constraint that can be
 * applied to an entity to check if it is valid or not.
 */
export interface IValidatorRule<T> {
    /**
     * Validate an entity to test if it meets the 
     * @param entity The entity to validate.
     */
    validate(entity: T): ValidatorRuleResult;
}