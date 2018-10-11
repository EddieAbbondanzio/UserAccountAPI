import { UserValidator } from "./uservalidator";
import { UserNotDeletedValidatorRule } from "../rules/usernotdeletedvalidatorrule";

/**
 * Validator to check that a user can be deleted.
 */
export class UserDeleteValidator extends UserValidator {
    /**
     * Create a new user delete validator.
     */
    constructor() {
        super();
        this.rules.push(new UserNotDeletedValidatorRule());
    }
}