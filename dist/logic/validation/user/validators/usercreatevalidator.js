"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usernamevalidatorrule_1 = require("../rules/usernamevalidatorrule");
const passwordvalidatorrule_1 = require("../rules/passwordvalidatorrule");
const emailvalidatorrule_1 = require("../rules/emailvalidatorrule");
const namevalidatorrule_1 = require("../rules/namevalidatorrule");
const validator_1 = require("../../validator");
/**
 * Validator to validate a new user when they are being
 * created. This ensures all their properties comply
 * with the database constraints.
 */
class UserCreateValidator extends validator_1.Validator {
    /**
     * Create a new user creation validator.
     */
    constructor() {
        super();
        this.rules.push(new usernamevalidatorrule_1.UsernameValidatorRule(), new passwordvalidatorrule_1.PasswordValidatorRule(), new emailvalidatorrule_1.EmailValidatorRule(), new namevalidatorrule_1.NameValidatorRule());
    }
}
exports.UserCreateValidator = UserCreateValidator;
//# sourceMappingURL=usercreatevalidator.js.map