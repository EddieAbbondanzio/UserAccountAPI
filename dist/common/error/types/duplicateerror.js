"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Error for when an entity violates a unique constraint
 * of a database table.
 */
class DuplicateError extends Error {
    /**
     * Create a new error.
     * @param message The error message.
     */
    constructor(message) {
        super(message);
    }
}
exports.DuplicateError = DuplicateError;
//# sourceMappingURL=duplicateerror.js.map