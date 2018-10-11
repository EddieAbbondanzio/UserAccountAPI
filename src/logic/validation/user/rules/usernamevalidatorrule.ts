import { StringUtils } from "../../../../util/stringutils";
import { User } from "../../../../data/user/user";
import { IValidatorRule } from "../../../validation/ivalidatorrule";
import { ValidatorRuleResult } from "../../../validation/validatorruleresult";

/**
 * Validates the user's real name to ensure it's not missing,
 * and it's not too long.
 */
export class UserNameValidatorRule implements IValidatorRule<User> {
    private static NAME_MISSING_ERROR: string  = 'Name is missing.';
    private static NAME_TOO_LONG_ERROR: string = `Name must be ${User.MAX_NAME_LENGTH} characters or less.`; 

    /**
     * Validate the user to check that their real name
     * is valid.
     * @param user The user to check.
     * @returns The rule's result.
     */
    public validate(user: User): ValidatorRuleResult {
        //Any name?
        if(StringUtils.isEmpty(user.name)){
            return new ValidatorRuleResult(false, UserNameValidatorRule.NAME_MISSING_ERROR);
        }

        //Too long?
        if(user.name.length > User.MAX_NAME_LENGTH){
            return new ValidatorRuleResult(false, UserNameValidatorRule.NAME_TOO_LONG_ERROR);
        }

        return new ValidatorRuleResult(true);
    }
}