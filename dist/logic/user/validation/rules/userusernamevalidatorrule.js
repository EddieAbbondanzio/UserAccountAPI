"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringutils_1 = require("../../../../util/stringutils");
const user_1 = require("../../../../data/user/user");
const validatorruleresult_1 = require("../../../common/validation/validatorruleresult");
/**
 * Validator rule to ensure the user's username
 * complys with the database.
 */
class UserUsernameValidatorRule {
    /**
     * Validate the user to check that their username
     * is valid.
     * @param entity The user to check.
     * @returns The rule's result.
     */
    validate(entity) {
        //Any name?
        if (stringutils_1.StringUtils.isEmpty(entity.username)) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserUsernameValidatorRule.USERNAME_MISSING_ERROR);
        }
        //Min length?
        if (entity.username.length < user_1.User.MIN_USERNAME_LENGTH) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserUsernameValidatorRule.USERNAME_TOO_SHORT_ERROR);
        }
        //Max length?
        if (entity.username.length > user_1.User.MAX_USERNAME_LENGTH) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserUsernameValidatorRule.USERNAME_TOO_LONG_ERROR);
        }
        //Valid characters?
        if (!/^[-\w\_]$/.test(entity.username)) {
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
