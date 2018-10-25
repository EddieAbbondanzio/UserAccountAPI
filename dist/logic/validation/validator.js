"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validatorresult_1 = require("./validatorresult");
/**
 * Interface for validators to implement. They provide a way
 * to check objects to ensure good data.
 */
class Validator {
    /**
     * Create a new base user validator.
     */
    constructor() {
        this.rules = [];
    }
    /**
     * Validate the entity against the validator.
     * @param entity The entity to validate.
     * @returns The validation result.
     */
    validate(entity) {
        if (entity == null) {
            throw new Error('No entity passed in');
        }
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
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map