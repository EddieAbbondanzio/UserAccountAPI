import { StringUtils } from "../../../../util/stringutils";
import { IValidatorRule } from "../../ivalidatorrule";
import { ValidatorRuleResult } from "../../validatorruleresult";
import { User } from "../../../models/user";
import { ArgumentError } from "../../../../common/error/types/argumenterror";
import { NullArgumentError } from "../../../../common/error/types/nullargumenterror";
import { UserRegistration } from "../../../common/userregistration";

/**
 * Validator rule to ensure the user's username
 * complys with the database.
 */
export class UsernameValidatorRule implements IValidatorRule<User>, IValidatorRule<UserRegistration>, IValidatorRule<string> {
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
    public validate(user: User|UserRegistration|string): ValidatorRuleResult {
        if(user == null){
            throw new NullArgumentError('user');
        }

        let username: string = typeof user === 'string' ? user : user.username;

        //Any name?
        if(StringUtils.isEmpty(username)){
            return new ValidatorRuleResult(false, UsernameValidatorRule.USERNAME_MISSING_ERROR);
        }

        //Min length?
        if(username.length < User.MIN_USERNAME_LENGTH){
            return new ValidatorRuleResult(false, UsernameValidatorRule.USERNAME_TOO_SHORT_ERROR);
        }

        //Max length?
        if(username.length > User.MAX_USERNAME_LENGTH){
            return new ValidatorRuleResult(false, UsernameValidatorRule.USERNAME_TOO_LONG_ERROR);
        }

        //Valid characters?
        if(!/^[a-z0-9_\-]+$/i.test(username)) {
            return new ValidatorRuleResult(false, UsernameValidatorRule.USERNAME_BAD_CHARS_ERROR);
        }

        return new ValidatorRuleResult(true);
    }
}