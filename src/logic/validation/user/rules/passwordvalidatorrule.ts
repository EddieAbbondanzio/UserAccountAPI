import { StringUtils } from "../../../../util/stringutils";
import { IValidatorRule } from "../../ivalidatorrule";
import { ValidatorRuleResult } from "../../validatorruleresult";
import { User } from "../../../models/user";
import { NullArgumentError } from "../../../../common/error/types/nullargumenterror";
import { UserRegistration } from "../../../common/userregistration";

/**
 * Validator rule to ensure a user's password is valid.
 */
export class PasswordValidatorRule implements IValidatorRule<User>, IValidatorRule<UserRegistration>, IValidatorRule<string> {
    private static PASSWORD_MISSING_ERROR: string = 'Password is required.';
    private static USERNAME_TOO_SHORT_ERROR: string = `Password must be at least ${User.MIN_PASSWORD_LENGTH} characters or more.`;

    /**
     * Validate the user to check that their password isn't
     * too long, or too short.
     * @param user The user to check.
     * @returns The validation result.
     */
    public validate(user: User|UserRegistration|string): ValidatorRuleResult {
        if (user == null) {
            throw new NullArgumentError('user');
        }

        if(user instanceof User) {
            if (StringUtils.isEmpty(user.passwordHash)) {
                return new ValidatorRuleResult(false, PasswordValidatorRule.PASSWORD_MISSING_ERROR);
            }
            else {
                return new ValidatorRuleResult(true);
            }
        }
        else {
            let password: string = typeof user === 'string' ? user : user.password;
            if (StringUtils.isEmpty(password)) {
                return new ValidatorRuleResult(false, PasswordValidatorRule.PASSWORD_MISSING_ERROR);
            }
            else if(password.length < User.MIN_PASSWORD_LENGTH) {
                return new ValidatorRuleResult(false, PasswordValidatorRule.USERNAME_TOO_SHORT_ERROR);
            } 
            else {
                return new ValidatorRuleResult(true);
            }
        }
    }
}