"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uservalidator_1 = require("./uservalidator");
const usernamevalidatorrule_1 = require("../rules/usernamevalidatorrule");
const useremailvalidatorrule_1 = require("../rules/useremailvalidatorrule");
/**
 * Validator to check that a user can be updated.
 */
class UserUpdateValidator extends uservalidator_1.UserValidator {
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
