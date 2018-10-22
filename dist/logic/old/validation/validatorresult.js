"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The results of a validator performing a
 * validation on an object.
 */
class ValidatorResult {
    /**
     * Create a new validation result.
     * @param isValid If the object was valid.
     * @param errors The errors of it (if any).
     */
    constructor(isValid, ...errors) {
        if (typeof isValid === 'boolean') {
            this.isValid = isValid;
        }
        else {
            this.isValid = false;
        }
        this.errors = errors ? errors : [];
    }
}
exports.ValidatorResult = ValidatorResult;
//# sourceMappingURL=validatorresult.js.map