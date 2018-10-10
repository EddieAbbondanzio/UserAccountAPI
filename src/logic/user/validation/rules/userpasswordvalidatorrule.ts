import { StringUtils } from "../../../../util/stringutils";
import { User } from "../../../../data/user/user";
import { IValidatorRule } from "../../../common/validation/ivalidatorrule";
import { ValidatorRuleResult } from "../../../common/validation/validatorruleresult";

/**
 * Validator rule to ensure a user's password is valid.
 */
export class UserPasswordValidatorRule implements IValidatorRule<User> {
    private static PASSWORD_MISSING_ERROR: string   = 'Password is required.';

    /**
     * Validate the user to check that their password isn't
     * too long, or too short.
     * @param entity The user to check.
     * @returns The validation result.
     */
    public validate(entity: User): ValidatorRuleResult {
        //Any password?
        if(StringUtils.isEmpty(entity.passwordHash)) {
            return new ValidatorRuleResult(false, UserPasswordValidatorRule.PASSWORD_MISSING_ERROR);
        }
        else {
            return new ValidatorRuleResult(true);
        }
    }
}