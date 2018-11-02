import { StringUtils } from "../../../../util/stringutils";
import { IValidatorRule } from "../../../validation/ivalidatorrule";
import { ValidatorRuleResult } from "../../../validation/validatorruleresult";
import { User } from "../../../models/user";

/**
 * Validates the user's real name to ensure it's not missing,
 * and it's not too long.
 */
export class UserNameValidatorRule implements IValidatorRule<User>, IValidatorRule<string> {
    private static NAME_MISSING_ERROR: string  = 'Name is missing.';
    private static NAME_TOO_LONG_ERROR: string = `Name must be ${User.MAX_NAME_LENGTH} characters or less.`; 

    /**
     * Validate the user to check that their real name
     * is valid.
     * @param user The user to check.
     * @returns The rule's result.
     */
    public validate(user: User|string): ValidatorRuleResult {
        if(!user){
            throw new Error('No user passed in.');
        }

        let name: string = typeof user === 'string' ? user : user.name;

        //Any name?
        if(StringUtils.isEmpty(name)){
            return new ValidatorRuleResult(false, UserNameValidatorRule.NAME_MISSING_ERROR);
        }

        //Too long?
        if(name.length > User.MAX_NAME_LENGTH){
            return new ValidatorRuleResult(false, UserNameValidatorRule.NAME_TOO_LONG_ERROR);
        }

        return new ValidatorRuleResult(true);
    }
}