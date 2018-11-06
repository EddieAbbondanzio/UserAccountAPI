import { NameValidatorRule } from "../rules/namevalidatorrule";
import { EmailValidatorRule } from "../rules/emailvalidatorrule";
import { Validator } from "../../validator";
import { User } from "../../../models/user";
import { IValidatorRule } from "../../ivalidatorrule";

/**
 * Validator to check that a user can be updated.
 */
export class UserUpdateValidator extends Validator<User> {
    /**
     * Create a new user update validator.
     */
    constructor(){
        super();
        this.rules.push(new NameValidatorRule() as IValidatorRule<User>,
                        new EmailValidatorRule());
    }
}