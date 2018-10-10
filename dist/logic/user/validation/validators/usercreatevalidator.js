"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uservalidator_1 = require("./uservalidator");
const userusernamevalidatorrule_1 = require("../rules/userusernamevalidatorrule");
const userpasswordvalidatorrule_1 = require("../rules/userpasswordvalidatorrule");
const useremailvalidatorrule_1 = require("../rules/useremailvalidatorrule");
const usernamevalidatorrule_1 = require("../rules/usernamevalidatorrule");
/**
 * Validator to validate a new user when they are being
 * created. This ensures all their properties comply
 * with the database constraints.
 */
class UserCreateValidator extends uservalidator_1.UserValidator {
    /**
     * Create a new user creation validator.
     */
    constructor() {
        super();
        this.rules = [new userusernamevalidatorrule_1.UserUsernameValidatorRule(),
            new userpasswordvalidatorrule_1.UserPasswordValidatorRule(),
            new useremailvalidatorrule_1.UserEmailValidatorRule(),
            new usernamevalidatorrule_1.UserNameValidatorRule()];
    }
}
exports.UserCreateValidator = UserCreateValidator;

//# sourceMappingURL=usercreatevalidator.js.map
