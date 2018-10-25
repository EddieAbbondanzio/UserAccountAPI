"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An argument error is for when a function
 * argument is invalid such as being null or
 * undefined.
 */
class ArgumentError extends Error {
    /**
     * Create a new invalid argument error.
     * @param argument The name of the argument.
     * @param message The error message.
     */
    constructor(argument, message) {
        super(argument + ' ' + (message ? message : 'is invalid.'));
        this.argument = argument;
    }
}
exports.ArgumentError = ArgumentError;
//# sourceMappingURL=argumenterror.js.map