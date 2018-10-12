import { UserValidator } from "./uservalidator";
import { UserNameValidatorRule } from "../rules/usernamevalidatorrule";
import { UserEmailValidatorRule } from "../rules/useremailvalidatorrule";

/**
 * Validator to check that a user can be updated.
 */
export class UserUpdateValidator extends UserValidator {
    /**
     * Create a new user update validator.
     */
    constructor(){
        super();
        this.rules.push(new UserNameValidatorRule(),
                        new UserEmailValidatorRule());
    }
}