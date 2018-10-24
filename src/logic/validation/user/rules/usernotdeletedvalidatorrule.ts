import { IValidatorRule } from "../../ivalidatorrule";
import { ValidatorRuleResult } from "../../validatorruleresult";
import { User } from "../../../models/user";

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
        if(!user){
            throw new Error('No user passed in.');
        }

        if(user.isDeleted){
            return new ValidatorRuleResult(false, 'User has already been deleted.');
        }
        else {
            return new ValidatorRuleResult(true);
        }
    }
}