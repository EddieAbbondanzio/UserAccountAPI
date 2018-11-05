"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An invalid operation occurs when something illegal was
 * performed.
 */
class InvalidOperationError extends Error {
    /**
     * Create a new invalid operation error message.
     * @param message The error message.
     */
    constructor(message) {
        super(message);
    }
}
exports.InvalidOperationError = InvalidOperationError;
//# sourceMappingURL=invalidoperation.js.map