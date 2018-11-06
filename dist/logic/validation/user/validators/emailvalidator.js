"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailvalidatorrule_1 = require("../rules/emailvalidatorrule");
const validator_1 = require("../../validator");
/**
 * Validator to validate an email for a user.
 */
class EmailValidator extends validator_1.Validator {
    /**
     * Create a new email validator.
     */
    constructor() {
        super();
        this.rules.push(new emailvalidatorrule_1.EmailValidatorRule());
    }
}
exports.EmailValidator = EmailValidator;
//# sourceMappingURL=emailvalidator.js.map