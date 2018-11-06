import { StringUtils } from "../../../../util/stringutils";
import { IValidatorRule } from "../../ivalidatorrule";
import { ValidatorRuleResult } from "../../validatorruleresult";
import { User } from "../../../models/user";
import { NullArgumentError } from "../../../../common/error/types/nullargumenterror";
import { UserRegistration } from "../../../common/userregistration";

/**
 * Validates that a user's email is not too long, or missing.
 */
export class EmailValidatorRule implements IValidatorRule<User>, IValidatorRule<UserRegistration>, IValidatorRule<string> {
    private static EMAIL_MISSING_ERROR: string  = 'Email is required.';
    private static EMAIL_TOO_LONG_ERROR: string = `Email must be ${User.MAX_EMAIL_LENGTH} characters or less.`;
    private static EMAIL_INVALID_FORM: string = 'Email is not a valid email in form "name@domain.com".'

    /**
     * Validate the user to check that their email
     * is valid.
     * @param user The user to check.
     * @returns The rule's result.
     */
    public validate(user: User|UserRegistration|string): ValidatorRuleResult {
        if(user == null){
            throw new NullArgumentError('user');
        }

        let email: string = null;

        //God I love typescript
        if(user instanceof User || user instanceof UserRegistration){
            email = user.email;
        }
        else {
            email = user;
        }

        //Any email?
        if(StringUtils.isEmpty(email)){
            return new ValidatorRuleResult(false, EmailValidatorRule.EMAIL_MISSING_ERROR);
        }
        
        //Too long?
        if(email.length > User.MAX_EMAIL_LENGTH){
            return new ValidatorRuleResult(false, EmailValidatorRule.EMAIL_TOO_LONG_ERROR);
        }

        //valid form?
        if(!this.validateEmail(email)){
            return new ValidatorRuleResult(false, EmailValidatorRule.EMAIL_INVALID_FORM)
        }

        return new ValidatorRuleResult(true);
    }

    /**
     * Validate an email against regex to check it's form.
     * Source: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
     * @param email The email to validate
     * @returns True if the email is valid.
     */
    private validateEmail(email: string) {
        var regex: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
      }
}