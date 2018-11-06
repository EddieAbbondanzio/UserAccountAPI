import { StringUtils } from "../../../../util/stringutils";
import { IValidatorRule } from "../../ivalidatorrule";
import { ValidatorRuleResult } from "../../validatorruleresult";
import { User } from "../../../models/user";
import { UserRegistration } from "../../../common/userregistration";
import { NullArgumentError } from "../../../../common/error/types/nullargumenterror";

/**
 * Validates the user's real name to ensure it's not missing,
 * and it's not too long.
 */
export class NameValidatorRule implements IValidatorRule<User>, IValidatorRule<UserRegistration>, IValidatorRule<string> {
    private static NAME_MISSING_ERROR: string  = 'Name is missing.';
    private static NAME_TOO_LONG_ERROR: string = `Name must be ${User.MAX_NAME_LENGTH} characters or less.`; 

    /**
     * Validate the user to check that their real name
     * is valid.
     * @param user The user to check.
     * @returns The rule's result.
     */
    public validate(user: User|UserRegistration|string): ValidatorRuleResult {
        if(user == null){
            throw new NullArgumentError('user');
        }

        let name: string = null;

        if(user instanceof User || user instanceof UserRegistration){
            name = user.name;
        }
        else {
            name = user;
        }

        //Any name?
        if(StringUtils.isEmpty(name)){
            return new ValidatorRuleResult(false, NameValidatorRule.NAME_MISSING_ERROR);
        }

        //Too long?
        if(name.length > User.MAX_NAME_LENGTH){
            return new ValidatorRuleResult(false, NameValidatorRule.NAME_TOO_LONG_ERROR);
        }

        return new ValidatorRuleResult(true);
    }
}