"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notdeletedvalidatorrule_1 = require("../rules/notdeletedvalidatorrule");
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
        this.rules.push(new notdeletedvalidatorrule_1.NotDeletedValidatorRule());
    }
}
exports.UserDeleteValidator = UserDeleteValidator;
//# sourceMappingURL=userdeletevalidator.js.map