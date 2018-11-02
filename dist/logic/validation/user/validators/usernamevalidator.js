"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../../validator");
const userusernamevalidatorrule_1 = require("../rules/userusernamevalidatorrule");
/**
 * Validator for validating a username of a user.
 */
class UsernameValidator extends validator_1.Validator {
    constructor() {
        super();
        this.rules.push(new userusernamevalidatorrule_1.UserUsernameValidatorRule());
    }
}
exports.UsernameValidator = UsernameValidator;
//# sourceMappingURL=usernamevalidator.js.map