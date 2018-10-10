"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The result of a single validation rule.
 * Contains an indicator if the rule was valid,
 * and if invalid, an error message.
 */
class ValidationRuleResult {
    /**
     * Create a new validation rule result set.
     * @param isValid If the rule was valid.
     * @param error The error message.
     */
    constructor(isValid, error) {
        if (typeof isValid === 'boolean') {
            this.isValid = isValid;
        }
        else {
            this.isValid = false;
        }
        this.error = error;
    }
}
exports.ValidationRuleResult = ValidationRuleResult;

//# sourceMappingURL=validationruleresult.js.map
