"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../../validator");
const usernamevalidatorrule_1 = require("../rules/usernamevalidatorrule");
/**
 * Validator for validating a username of a user.
 */
class UsernameValidator extends validator_1.Validator {
    constructor() {
        super();
        this.rules.push(new usernamevalidatorrule_1.UsernameValidatorRule());
    }
}
exports.UsernameValidator = UsernameValidator;
//# sourceMappingURL=usernamevalidator.js.map