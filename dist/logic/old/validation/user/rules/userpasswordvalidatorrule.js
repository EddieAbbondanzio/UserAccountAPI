"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringutils_1 = require("../../../../util/stringutils");
const validatorruleresult_1 = require("../../../validation/validatorruleresult");
/**
 * Validator rule to ensure a user's password is valid.
 */
class UserPasswordValidatorRule {
    /**
     * Validate the user to check that their password isn't
     * too long, or too short.
     * @param user The user to check.
     * @returns The validation result.
     */
    validate(user) {
        //Any password?
        if (stringutils_1.StringUtils.isEmpty(user.passwordHash)) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserPasswordValidatorRule.PASSWORD_MISSING_ERROR);
        }
        else {
            return new validatorruleresult_1.ValidatorRuleResult(true);
        }
    }
}
UserPasswordValidatorRule.PASSWORD_MISSING_ERROR = 'Password is required.';
exports.UserPasswordValidatorRule = UserPasswordValidatorRule;
//# sourceMappingURL=userpasswordvalidatorrule.js.map