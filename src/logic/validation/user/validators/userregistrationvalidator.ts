import { UsernameValidatorRule } from "../rules/usernamevalidatorrule";
import { PasswordValidatorRule } from "../rules/passwordvalidatorrule";
import { EmailValidatorRule } from "../rules/emailvalidatorrule";
import { NameValidatorRule } from "../rules/namevalidatorrule";
import { Validator } from "../../validator";
import { User } from "../../../models/user";
import { IValidatorRule } from "../../ivalidatorrule";
import { UserRegistration } from "../../../common/userregistration";

/**
 * Validator to validate a new user when they are being
 * created. This ensures all their properties comply
 * with the database constraints.
 */
export class UserRegistrationValidator extends Validator<UserRegistration> {
    /**
     * Create a new user creation validator.
     */
    constructor(){
        super();

        this.rules.push(new UsernameValidatorRule(),
                        new PasswordValidatorRule(),
                        new EmailValidatorRule(),
                        new NameValidatorRule());
    }
}