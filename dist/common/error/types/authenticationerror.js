"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An error for a failed credentials attempt.
 */
class AuthenticationError extends Error {
    /**
     * Create a new authentication error.
     * @param message The message of the error.
     */
    constructor(message) {
        super(message);
    }
}
exports.AuthenticationError = AuthenticationError;
//# sourceMappingURL=authenticationerror.js.map