"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringutils_1 = require("../../../../util/stringutils");
const validatorruleresult_1 = require("../../../validation/validatorruleresult");
const user_1 = require("../../../models/user");
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
        if (!user) {
            throw new Error('No user passed in.');
        }
        let name = typeof user === 'string' ? user : user.name;
        //Any name?
        if (stringutils_1.StringUtils.isEmpty(name)) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserNameValidatorRule.NAME_MISSING_ERROR);
        }
        //Too long?
        if (name.length > user_1.User.MAX_NAME_LENGTH) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserNameValidatorRule.NAME_TOO_LONG_ERROR);
        }
        return new validatorruleresult_1.ValidatorRuleResult(true);
    }
}
UserNameValidatorRule.NAME_MISSING_ERROR = 'Name is missing.';
UserNameValidatorRule.NAME_TOO_LONG_ERROR = `Name must be ${user_1.User.MAX_NAME_LENGTH} characters or less.`;
exports.UserNameValidatorRule = UserNameValidatorRule;
//# sourceMappingURL=usernamevalidatorrule.js.map