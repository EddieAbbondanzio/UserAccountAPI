"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../user");
const stringutils_1 = require("../../../../util/stringutils");
const validatorruleresult_1 = require("../../../common/validation/validatorruleresult");
/**
 * Validates that a user's email is not too long, or missing.
 */
class UserEmailValidatorRule {
    /**
     * Validate the user to check that their email
     * is valid.
     * @param entity The user to check.
     * @returns The rule's result.
     */
    validate(entity) {
        //Any email?
        if (stringutils_1.StringUtils.isEmpty(entity.email)) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserEmailValidatorRule.EMAIL_MISSING_ERROR);
        }
        //Too long?
        if (entity.email.length > user_1.User.MAX_EMAIL_LENGTH) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserEmailValidatorRule.EMAIL_TOO_LONG_ERROR);
        }
        return new validatorruleresult_1.ValidatorRuleResult(true);
    }
}
UserEmailValidatorRule.EMAIL_MISSING_ERROR = 'Email is required.';
UserEmailValidatorRule.EMAIL_TOO_LONG_ERROR = `Email must be ${user_1.User.MAX_EMAIL_LENGTH} characters or less.`;
exports.UserEmailValidatorRule = UserEmailValidatorRule;

//# sourceMappingURL=useremailvalidatorrule.js.map
