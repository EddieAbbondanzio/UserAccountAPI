"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringutils_1 = require("../../../../util/stringutils");
const validatorruleresult_1 = require("../../validatorruleresult");
const user_1 = require("../../../models/user");
const nullargumenterror_1 = require("../../../../common/error/types/nullargumenterror");
const userregistration_1 = require("../../../common/userregistration");
/**
 * Validates that a user's email is not too long, or missing.
 */
class EmailValidatorRule {
    /**
     * Validate the user to check that their email
     * is valid.
     * @param user The user to check.
     * @returns The rule's result.
     */
    validate(user) {
        if (user == null) {
            throw new nullargumenterror_1.NullArgumentError('user');
        }
        let email = null;
        //God I love typescript
        if (user instanceof user_1.User || user instanceof userregistration_1.UserRegistration) {
            email = user.email;
        }
        else {
            email = user;
        }
        //Any email?
        if (stringutils_1.StringUtils.isEmpty(email)) {
            return new validatorruleresult_1.ValidatorRuleResult(false, EmailValidatorRule.EMAIL_MISSING_ERROR);
        }
        //Too long?
        if (email.length > user_1.User.MAX_EMAIL_LENGTH) {
            return new validatorruleresult_1.ValidatorRuleResult(false, EmailValidatorRule.EMAIL_TOO_LONG_ERROR);
        }
        //valid form?
        if (!this.validateEmail(email)) {
            return new validatorruleresult_1.ValidatorRuleResult(false, EmailValidatorRule.EMAIL_INVALID_FORM);
        }
        return new validatorruleresult_1.ValidatorRuleResult(true);
    }
    /**
     * Validate an email against regex to check it's form.
     * Source: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
     * @param email The email to validate
     * @returns True if the email is valid.
     */
    validateEmail(email) {
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }
}
EmailValidatorRule.EMAIL_MISSING_ERROR = 'Email is required.';
EmailValidatorRule.EMAIL_TOO_LONG_ERROR = `Email must be ${user_1.User.MAX_EMAIL_LENGTH} characters or less.`;
EmailValidatorRule.EMAIL_INVALID_FORM = 'Email is not a valid email in form "name@domain.com".';
exports.EmailValidatorRule = EmailValidatorRule;
//# sourceMappingURL=emailvalidatorrule.js.map