"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An error handler offers some extra functionality for
 * only catching errors of specific types, etc..
 */
class ErrorHandler {
    /**
     * Create a new error handler for dealing
     * with an error in a try catch.
     * @param error The error to work with.
     */
    constructor(error) {
        this.error = error;
        this.wasCaught = false;
    }
    /**
     * Catch the error only if it matches the constructor
     * passed in.
     * @param constructor The constructor of the error
     * we should be trying to catch.
     * @param handler The handler to call if the error is of
     * the type.
     */
    catch(constructor, handler) {
        if (this.wasCaught) {
            return this;
        }
        if (this.error instanceof constructor) {
            this.wasCaught = true;
            handler(this.error);
        }
        return this;
    }
    /**
     * If the error has not been caught yet, throw it
     * again so we can pass it to a higher up.
     */
    otherwiseRaise() {
        if (!this.wasCaught) {
            throw this.error;
        }
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=errorhandler.js.map