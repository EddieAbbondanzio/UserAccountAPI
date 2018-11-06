"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validatorruleresult_1 = require("../../validatorruleresult");
/**
 * Validator rule to check that a user hasn't already been deleted.
 */
class NotDeletedValidatorRule {
    /**
     * Validate a user against the validation rule.
     * @param user The user to validate.
     * @returns The validation result.
     */
    validate(user) {
        if (!user) {
            throw new Error('No user passed in.');
        }
        if (user.isDeleted) {
            return new validatorruleresult_1.ValidatorRuleResult(false, 'User has already been deleted.');
        }
        else {
            return new validatorruleresult_1.ValidatorRuleResult(true);
        }
    }
}
exports.NotDeletedValidatorRule = NotDeletedValidatorRule;
//# sourceMappingURL=notdeletedvalidatorrule.js.map