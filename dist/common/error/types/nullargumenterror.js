"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An error for when a method argument is null,
 * and is not an allowed value.
 */
class NullArgumentError extends Error {
    /**
     * Create a new invalid argument error.
     * @param argument The name of the argument.
     * @param message The error message.
     */
    constructor(argument, message) {
        super(argument + ' ' + (message ? message : 'is null.'));
        this.argument = argument;
    }
}
exports.NullArgumentError = NullArgumentError;
//# sourceMappingURL=nullargumenterror.js.map