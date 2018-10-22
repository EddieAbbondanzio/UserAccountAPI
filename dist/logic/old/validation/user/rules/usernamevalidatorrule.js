"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringutils_1 = require("../../../../util/stringutils");
const user_1 = require("../../../../data/user/user");
const validatorruleresult_1 = require("../../../validation/validatorruleresult");
/**
 * Validates the user's real name to ensure it's not missing,
 * and it's not too long.
 */
class UserNameValidatorRule {
    /**
     * Validate the user to check that their real name
     * is valid.
     * @param user The user to check.
     * @returns The rule's result.
     */
    validate(user) {
        //Any name?
        if (stringutils_1.StringUtils.isEmpty(user.name)) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserNameValidatorRule.NAME_MISSING_ERROR);
        }
        //Too long?
        if (user.name.length > user_1.User.MAX_NAME_LENGTH) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserNameValidatorRule.NAME_TOO_LONG_ERROR);
        }
        return new validatorruleresult_1.ValidatorRuleResult(true);
    }
}
UserNameValidatorRule.NAME_MISSING_ERROR = 'Name is missing.';
UserNameValidatorRule.NAME_TOO_LONG_ERROR = `Name must be ${user_1.User.MAX_NAME_LENGTH} characters or less.`;
exports.UserNameValidatorRule = UserNameValidatorRule;
//# sourceMappingURL=usernamevalidatorrule.js.map