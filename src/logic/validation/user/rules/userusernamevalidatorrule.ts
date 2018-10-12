import { StringUtils } from "../../../../util/stringutils";
import { User } from "../../../../data/user/user";
import { IValidatorRule } from "../../../validation/ivalidatorrule";
import { ValidatorRuleResult } from "../../../validation/validatorruleresult";

/**
 * Validator rule to ensure the user's username
 * complys with the database.
 */
export class UserUsernameValidatorRule implements IValidatorRule<User> {
    private static USERNAME_MISSING_ERROR: string   = 'Username is required.'
    private static USERNAME_TOO_SHORT_ERROR: string = `Username must be at least ${User.MIN_USERNAME_LENGTH} characters or more.`;
    private static USERNAME_TOO_LONG_ERROR: string  = `Username must be ${User.MAX_USERNAME_LENGTH} characters or less.`;
    private static USERNAME_BAD_CHARS_ERROR: string = 'Username may only contain alphanumeric, or underscore as characters';

    /**
     * Validate the user to check that their username
     * is valid.
     * @param user The user to check.
     * @returns The rule's result.
     */
    public validate(user: User): ValidatorRuleResult {
        //Any name?
        if(StringUtils.isEmpty(user.username)){
            return new ValidatorRuleResult(false, UserUsernameValidatorRule.USERNAME_MISSING_ERROR);
        }

        //Min length?
        if(user.username.length < User.MIN_USERNAME_LENGTH){
            return new ValidatorRuleResult(false, UserUsernameValidatorRule.USERNAME_TOO_SHORT_ERROR);
        }

        //Max length?
        if(user.username.length > User.MAX_USERNAME_LENGTH){
            return new ValidatorRuleResult(false, UserUsernameValidatorRule.USERNAME_TOO_LONG_ERROR);
        }

        //Valid characters?
        if(!/^[a-z0-9_\-]+$/i.test(user.username)) {
            return new ValidatorRuleResult(false, UserUsernameValidatorRule.USERNAME_BAD_CHARS_ERROR);
        }

        return new ValidatorRuleResult(true);
    }
}