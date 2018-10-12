import { UserNameValidatorRule } from "../rules/usernamevalidatorrule";
import { UserEmailValidatorRule } from "../rules/useremailvalidatorrule";
import { User } from "../../../../data/user/user";
import { Validator } from "../../validator";

/**
 * Validator to check that a user can be updated.
 */
export class UserUpdateValidator extends Validator<User> {
    /**
     * Create a new user update validator.
     */
    constructor(){
        super();
        this.rules.push(new UserNameValidatorRule(),
                        new UserEmailValidatorRule());
    }
}