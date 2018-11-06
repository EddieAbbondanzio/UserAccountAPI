"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringutils_1 = require("../../../../util/stringutils");
const validatorruleresult_1 = require("../../validatorruleresult");
const user_1 = require("../../../models/user");
const nullargumenterror_1 = require("../../../../common/error/types/nullargumenterror");
/**
 * Validator rule to ensure a user's password is valid.
 */
class PasswordValidatorRule {
    /**
     * Validate the user to check that their password isn't
     * too long, or too short.
     * @param user The user to check.
     * @returns The validation result.
     */
    validate(user) {
        if (user == null) {
            throw new nullargumenterror_1.NullArgumentError('user');
        }
        if (user instanceof user_1.User) {
            if (stringutils_1.StringUtils.isEmpty(user.passwordHash)) {
                return new validatorruleresult_1.ValidatorRuleResult(false, PasswordValidatorRule.PASSWORD_MISSING_ERROR);
            }
            else {
                return new validatorruleresult_1.ValidatorRuleResult(true);
            }
        }
        else {
            let password = typeof user === 'string' ? user : user.password;
            if (stringutils_1.StringUtils.isEmpty(password)) {
                return new validatorruleresult_1.ValidatorRuleResult(false, PasswordValidatorRule.PASSWORD_MISSING_ERROR);
            }
            else if (password.length < user_1.User.MIN_PASSWORD_LENGTH) {
                return new validatorruleresult_1.ValidatorRuleResult(false, PasswordValidatorRule.USERNAME_TOO_SHORT_ERROR);
            }
            else {
                return new validatorruleresult_1.ValidatorRuleResult(true);
            }
        }
    }
}
PasswordValidatorRule.PASSWORD_MISSING_ERROR = 'Password is required.';
PasswordValidatorRule.USERNAME_TOO_SHORT_ERROR = `Password must be at least ${user_1.User.MIN_PASSWORD_LENGTH} characters or more.`;
exports.PasswordValidatorRule = PasswordValidatorRule;
//# sourceMappingURL=passwordvalidatorrule.js.map