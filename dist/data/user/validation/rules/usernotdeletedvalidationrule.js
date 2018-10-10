"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validatorruleresult_1 = require("../../../common/validation/validatorruleresult");
/**
 * Validation rule to ensure that the user isn't deleted.
 */
class UserNotDeletedValidatorRule {
    /**
     * Validate the rule against the user.
     * @param entity The user to check.
     * @returns The validator rule result.
     */
    validate(entity) {
        if (entity.isDeleted) {
            return new validatorruleresult_1.ValidatorRuleResult(false, UserNotDeletedValidatorRule.USER_DELETED_ERROR);
        }
        else {
            return new validatorruleresult_1.ValidatorRuleResult(true);
        }
    }
}
/**
 * The error message to return with when the rule fails.
 */
UserNotDeletedValidatorRule.USER_DELETED_ERROR = "User has been deleted.";
exports.UserNotDeletedValidatorRule = UserNotDeletedValidatorRule;

//# sourceMappingURL=usernotdeletedvalidationrule.js.map
