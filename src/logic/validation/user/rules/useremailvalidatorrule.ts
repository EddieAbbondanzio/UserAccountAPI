import { StringUtils } from "../../../../util/stringutils";
import { User } from "../../../../data/user/user";
import { IValidatorRule } from "../../../validation/ivalidatorrule";
import { ValidatorRuleResult } from "../../../validation/validatorruleresult";

/**
 * Validates that a user's email is not too long, or missing.
 */
export class UserEmailValidatorRule implements IValidatorRule<User> {
    private static EMAIL_MISSING_ERROR: string  = 'Email is required.';
    private static EMAIL_TOO_LONG_ERROR: string = `Email must be ${User.MAX_EMAIL_LENGTH} characters or less.`;

    /**
     * Validate the user to check that their email
     * is valid.
     * @param user The user to check.
     * @returns The rule's result.
     */
    public validate(user: User): ValidatorRuleResult {
        //Any email?
        if(StringUtils.isEmpty(user.email)){
            return new ValidatorRuleResult(false, UserEmailValidatorRule.EMAIL_MISSING_ERROR);
        }
        
        //Too long?
        if(user.email.length > User.MAX_EMAIL_LENGTH){
            return new ValidatorRuleResult(false, UserEmailValidatorRule.EMAIL_TOO_LONG_ERROR);
        }

        return new ValidatorRuleResult(true);
    }
}