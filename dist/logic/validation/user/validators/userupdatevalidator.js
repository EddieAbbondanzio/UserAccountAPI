"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usernamevalidatorrule_1 = require("../rules/usernamevalidatorrule");
const useremailvalidatorrule_1 = require("../rules/useremailvalidatorrule");
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
        this.rules.push(new usernamevalidatorrule_1.UserNameValidatorRule(), new useremailvalidatorrule_1.UserEmailValidatorRule());
    }
}
exports.UserUpdateValidator = UserUpdateValidator;

//# sourceMappingURL=userupdatevalidator.js.map
