"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usernotdeletedvalidatorrule_1 = require("../rules/usernotdeletedvalidatorrule");
const validator_1 = require("../../validator");
/**
 * Validator to check that a user can be deleted.
 */
class UserDeleteValidator extends validator_1.Validator {
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