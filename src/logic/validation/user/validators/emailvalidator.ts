import { UserEmailValidatorRule } from "../rules/useremailvalidatorrule";
import { Validator } from "../../validator";

/**
 * Validator to validate an email for a user.
 */
export class EmailValidator extends Validator<string> {
    /**
     * Create a new email validator.
     */
    constructor() {
        super();
        this.rules.push(new UserEmailValidatorRule());
    }
}