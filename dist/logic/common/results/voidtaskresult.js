"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A task result that doesn't have any value to return back.
 */
class VoidTaskResult {
    /**
     * Create a new void task result.
     * @param success The success flag.
     * @param errors Any error messages.
     */
    constructor(success, ...errors) {
        this.success = success;
        this.errors = errors;
    }
    /**
     * Create a new successful result.
     * @param value The value to return.
     * @returns The newly created result.
     */
    static successResult() {
        return new VoidTaskResult(true);
    }
    /**
     * Create a new error based result.
     * @param errors The error messsages of errors that occured.
     * @returns The newly created error result.
     */
    static errorResult(...errors) {
        return new VoidTaskResult(false, ...errors);
    }
}
exports.VoidTaskResult = VoidTaskResult;

//# sourceMappingURL=voidtaskresult.js.map
