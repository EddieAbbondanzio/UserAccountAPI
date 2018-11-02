import { Validator } from "../../validator";
import { UserUsernameValidatorRule } from "../rules/userusernamevalidatorrule";

/**
 * Validator for validating a username of a user.
 */
export class UsernameValidator extends Validator<string> {
    constructor() {
        super();
        this.rules.push(new UserUsernameValidatorRule());
    }
}