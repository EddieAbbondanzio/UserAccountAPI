"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringutils_1 = require("../../../../util/stringutils");
const validatorruleresult_1 = require("../../../validation/validatorruleresult");
const user_1 = require("../../../models/user");
const nullargumenterror_1 = require("../../../../common/error/types/nullargumenterror");
/**
 * Validator rule to ensure the user's username
 * complys with the database.
 */
class UserUsernameValidatorRule {
    /**
     * Validate the user to check that their username
     * is valid.
     * @param user The user to check.
     * @returns The rule's result.
     */
    validate(user) {
        if (user == null) {
            throw new nullargumenterror_1.NullArgumentError('user');
        }
        let username = typeof user === 'string' ? user : user.username;
        //Any name?
        if (stringutils_1.StringUtils.isEmpty(username)) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserUsernameValidatorRule.USERNAME_MISSING_ERROR);
        }
        //Min length?
        if (username.length < user_1.User.MIN_USERNAME_LENGTH) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserUsernameValidatorRule.USERNAME_TOO_SHORT_ERROR);
        }
        //Max length?
        if (username.length > user_1.User.MAX_USERNAME_LENGTH) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserUsernameValidatorRule.USERNAME_TOO_LONG_ERROR);
        }
        //Valid characters?
        if (!/^[a-z0-9_\-]+$/i.test(username)) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserUsernameValidatorRule.USERNAME_BAD_CHARS_ERROR);
        }
        return new validatorruleresult_1.ValidatorRuleResult(true);
    }
}
UserUsernameValidatorRule.USERNAME_MISSING_ERROR = 'Username is required.';
UserUsernameValidatorRule.USERNAME_TOO_SHORT_ERROR = `Username must be at least ${user_1.User.MIN_USERNAME_LENGTH} characters or more.`;
UserUsernameValidatorRule.USERNAME_TOO_LONG_ERROR = `Username must be ${user_1.User.MAX_USERNAME_LENGTH} characters or less.`;
UserUsernameValidatorRule.USERNAME_BAD_CHARS_ERROR = 'Username may only contain alphanumeric, or underscore as characters';
exports.UserUsernameValidatorRule = UserUsernameValidatorRule;
//# sourceMappingURL=userusernamevalidatorrule.js.map