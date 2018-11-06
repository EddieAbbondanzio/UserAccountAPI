import { Validator } from "../../validator";
import { UsernameValidatorRule } from "../rules/usernamevalidatorrule";

/**
 * Validator for validating a username of a user.
 */
export class UsernameValidator extends Validator<string> {
    constructor() {
        super();
        this.rules.push(new UsernameValidatorRule());
    }
}