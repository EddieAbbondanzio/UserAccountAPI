import { NotDeletedValidatorRule } from "../rules/notdeletedvalidatorrule";
import { Validator } from "../../validator";
import { User } from "../../../models/user";

/**
 * Validator to check that a user can be deleted.
 */
export class UserDeleteValidator extends Validator<User> {
    /**
     * Create a new user delete validator.
     */
    constructor() {
        super();
        this.rules.push(new NotDeletedValidatorRule());
    }
}