import { UserUsernameValidatorRule } from "../rules/userusernamevalidatorrule";
import { UserPasswordValidatorRule } from "../rules/userpasswordvalidatorrule";
import { UserEmailValidatorRule } from "../rules/useremailvalidatorrule";
import { UserNameValidatorRule } from "../rules/usernamevalidatorrule";
import { User } from "../../../../data/user/user";
import { IValidatorRule } from "../../ivalidatorrule";
import { Validator } from "../../validator";

/**
 * Validator to validate a new user when they are being
 * created. This ensures all their properties comply
 * with the database constraints.
 */
export class UserCreateValidator extends Validator<User> {
    /**
     * Create a new user creation validator.
     */
    constructor(){
        super();

        this.rules.push(new UserUsernameValidatorRule(),
                        new UserPasswordValidatorRule(),
                        new UserEmailValidatorRule(),
                        new UserNameValidatorRule());
    }
}