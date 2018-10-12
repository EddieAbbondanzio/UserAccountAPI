"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Custom error to handle a bad validation result.
 */
class ValidationError extends Error {
    /**
     * Create a new custom error for validators that fail.
     * @param message Summary of the issue.
     * @param validatorResult The validator's output.
     */
    constructor(message, validatorResult) {
        super(message);
    }
}
exports.ValidationError = ValidationError;

//# sourceMappingURL=validationerror.js.map
