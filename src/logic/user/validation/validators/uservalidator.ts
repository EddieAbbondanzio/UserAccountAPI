import { User } from "../../../../data/user/user";
import { IValidator } from "../../../common/validation/ivalidator";
import { IValidatorRule } from "../../../common/validation/ivalidatorrule";
import { ValidatorResult } from "../../../common/validation/validatorresult";
import { ValidatorRuleResult } from "../../../common/validation/validatorruleresult";

/**
 * Base class for user validators to derive from. 
 */
export abstract class UserValidator implements IValidator<User> {
    /**
     * The list of rules that belongs to this validator.
     */
    public abstract rules: IValidatorRule<User>[];

    /**
     * Validate the user against the validator.
     * @param entity The user to validate.
     * @returns The validation result.
     */
    public validate(entity: User): ValidatorResult {
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