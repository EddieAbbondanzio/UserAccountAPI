"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validatorresult_1 = require("../../validatorresult");
/**
 * Base class for user validators to derive from.
 */
class UserValidator {
    /**
     * Create a new base user validator.
     */
    constructor() {
        this.rules = [];
    }
    /**
     * Validate the user against the validator.
     * @param entity The user to validate.
     * @returns The validation result.
     */
    validate(entity) {
        let result = new validatorresult_1.ValidatorResult();
        for (let i = 0; i < this.rules.length; i++) {
            let ruleResult = this.rules[i].validate(entity);
            if (!ruleResult.isValid) {
                result.errors.push(ruleResult.error);
            }
        }
        if (result.errors.length == 0) {
            result.isValid = true;
        }
        return result;
    }
}
exports.UserValidator = UserValidator;

//# sourceMappingURL=uservalidator.js.map
