import { IValidatorRule } from "../../ivalidatorrule";
import { User } from "../../../../data/user/user";
import { ValidatorRuleResult } from "../../validatorruleresult";

/**
 * Validator rule to check that a user hasn't already been deleted.
 */
export class UserNotDeletedValidatorRule implements IValidatorRule<User> {
    /**
     * Validate a user against the validation rule.
     * @param user The user to validate.
     * @returns The validation result.
     */
    public validate(user: User): ValidatorRuleResult {
        if(user.isDeleted){
            return new ValidatorRuleResult(false, 'User has already been deleted.');
        }
        else {
            return new ValidatorRuleResult(true);
        }
    }
}