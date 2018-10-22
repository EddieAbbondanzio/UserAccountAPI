import { StringUtils } from "../../../../util/stringutils";
import { IValidatorRule } from "../../../validation/ivalidatorrule";
import { ValidatorRuleResult } from "../../../validation/validatorruleresult";
import { User } from "../../../models/user";

/**
 * Validator rule to ensure a user's password is valid.
 */
export class UserPasswordValidatorRule implements IValidatorRule<User> {
    private static PASSWORD_MISSING_ERROR: string   = 'Password is required.';

    /**
     * Validate the user to check that their password isn't
     * too long, or too short.
     * @param user The user to check.
     * @returns The validation result.
     */
    public validate(user: User): ValidatorRuleResult {
        //Any password?
        if(StringUtils.isEmpty(user.passwordHash)) {
            return new ValidatorRuleResult(false, UserPasswordValidatorRule.PASSWORD_MISSING_ERROR);
        }
        else {
            return new ValidatorRuleResult(true);
        }
    }
}