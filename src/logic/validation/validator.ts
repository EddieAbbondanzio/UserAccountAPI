import { ValidatorResult } from "./validatorresult";
import { IValidatorRule } from "./ivalidatorrule";
import { ValidatorRuleResult } from "./validatorruleresult";

/**
 * Interface for validators to implement. They provide a way
 * to check objects to ensure good data.
 */
export abstract class Validator<T> {
    /**
     * The list of rules that belongs to this validator.
     */
    public rules: IValidatorRule<T>[];

    /**
     * Create a new base user validator.
     */
    constructor(){
        this.rules = [];
    }

    /**
     * Validate the entity against the validator.
     * @param entity The entity to validate.
     * @returns The validation result.
     */
    public validate(entity: T): ValidatorResult {
        let result: ValidatorResult = new ValidatorResult();
        
        for(let i = 0; i < this.rules.length; i++){
            let ruleResult: ValidatorRuleResult = this.rules[i].validate(entity);

            if(!ruleResult.isValid) {
                result.errors.push(ruleResult.error);
            }
        }

        if(result.errors.length == 0){
            result.isValid = true;
        }

        return result;
    }
}