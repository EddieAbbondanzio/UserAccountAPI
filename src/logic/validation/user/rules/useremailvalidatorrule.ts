import { StringUtils } from "../../../../util/stringutils";
import { IValidatorRule } from "../../../validation/ivalidatorrule";
import { ValidatorRuleResult } from "../../../validation/validatorruleresult";
import { User } from "../../../models/user";

/**
 * Validates that a user's email is not too long, or missing.
 */
export class UserEmailValidatorRule implements IValidatorRule<User> {
    private static EMAIL_MISSING_ERROR: string  = 'Email is required.';
    private static EMAIL_TOO_LONG_ERROR: string = `Email must be ${User.MAX_EMAIL_LENGTH} characters or less.`;
    private static EMAIL_INVALID_FORM: string = 'Email is not a valid email in form "name@domain.com".'

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

        //valid form?
        if(!this.validateEmail(user.email)){
            return new ValidatorRuleResult(false, UserEmailValidatorRule.EMAIL_INVALID_FORM)
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