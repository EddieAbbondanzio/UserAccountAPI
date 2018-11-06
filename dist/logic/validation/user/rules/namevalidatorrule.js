"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringutils_1 = require("../../../../util/stringutils");
const validatorruleresult_1 = require("../../validatorruleresult");
const user_1 = require("../../../models/user");
const userregistration_1 = require("../../../common/userregistration");
const nullargumenterror_1 = require("../../../../common/error/types/nullargumenterror");
/**
 * Validates the user's real name to ensure it's not missing,
 * and it's not too long.
 */
class NameValidatorRule {
    /**
     * Validate the user to check that their real name
     * is valid.
     * @param user The user to check.
     * @returns The rule's result.
     */
    validate(user) {
        if (user == null) {
            throw new nullargumenterror_1.NullArgumentError('user');
        }
        let name = null;
        if (user instanceof user_1.User || user instanceof userregistration_1.UserRegistration) {
            name = user.name;
        }
        else {
            name = user;
        }
        //Any name?
        if (stringutils_1.StringUtils.isEmpty(name)) {
            return new validatorruleresult_1.ValidatorRuleResult(false, NameValidatorRule.NAME_MISSING_ERROR);
        }
        //Too long?
        if (name.length > user_1.User.MAX_NAME_LENGTH) {
            return new validatorruleresult_1.ValidatorRuleResult(false, NameValidatorRule.NAME_TOO_LONG_ERROR);
        }
        return new validatorruleresult_1.ValidatorRuleResult(true);
    }
}
NameValidatorRule.NAME_MISSING_ERROR = 'Name is missing.';
NameValidatorRule.NAME_TOO_LONG_ERROR = `Name must be ${user_1.User.MAX_NAME_LENGTH} characters or less.`;
exports.NameValidatorRule = NameValidatorRule;
//# sourceMappingURL=namevalidatorrule.js.map