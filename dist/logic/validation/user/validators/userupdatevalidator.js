"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const namevalidatorrule_1 = require("../rules/namevalidatorrule");
const emailvalidatorrule_1 = require("../rules/emailvalidatorrule");
const validator_1 = require("../../validator");
/**
 * Validator to check that a user can be updated.
 */
class UserUpdateValidator extends validator_1.Validator {
    /**
     * Create a new user update validator.
     */
    constructor() {
        super();
        this.rules.push(new namevalidatorrule_1.NameValidatorRule(), new emailvalidatorrule_1.EmailValidatorRule());
    }
}
exports.UserUpdateValidator = UserUpdateValidator;
//# sourceMappingURL=userupdatevalidator.js.map