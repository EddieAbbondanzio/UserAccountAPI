"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringutils_1 = require("../../../../util/stringutils");
const user_1 = require("../../../../data/user/user");
const validatorruleresult_1 = require("../../../validation/validatorruleresult");
/**
 * Validates that a user's email is not too long, or missing.
 */
class UserEmailValidatorRule {
    /**
     * Validate the user to check that their email
     * is valid.
     * @param user The user to check.
     * @returns The rule's result.
     */
    validate(user) {
        //Any email?
        if (stringutils_1.StringUtils.isEmpty(user.email)) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserEmailValidatorRule.EMAIL_MISSING_ERROR);
        }
        //Too long?
        if (user.email.length > user_1.User.MAX_EMAIL_LENGTH) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserEmailValidatorRule.EMAIL_TOO_LONG_ERROR);
        }
        return new validatorruleresult_1.ValidatorRuleResult(true);
    }
}
UserEmailValidatorRule.EMAIL_MISSING_ERROR = 'Email is required.';
UserEmailValidatorRule.EMAIL_TOO_LONG_ERROR = `Email must be ${user_1.User.MAX_EMAIL_LENGTH} characters or less.`;
exports.UserEmailValidatorRule = UserEmailValidatorRule;

//# sourceMappingURL=useremailvalidatorrule.js.map
