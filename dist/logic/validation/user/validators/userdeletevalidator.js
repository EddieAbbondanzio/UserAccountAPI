"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uservalidator_1 = require("./uservalidator");
const usernotdeletedvalidatorrule_1 = require("../rules/usernotdeletedvalidatorrule");
/**
 * Validator to check that a user can be deleted.
 */
class UserDeleteValidator extends uservalidator_1.UserValidator {
    /**
     * Create a new user delete validator.
     */
    constructor() {
        super();
        this.rules.push(new usernotdeletedvalidatorrule_1.UserNotDeletedValidatorRule());
    }
}
exports.UserDeleteValidator = UserDeleteValidator;

//# sourceMappingURL=userdeletevalidator.js.map
