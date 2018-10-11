"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A task result that has a value to return. Note
 * a success flag of true should not be considered
 * an indicator if the value being returned is not null.
 */
class TaskResult {
    /**
     * Create a new task result.
     * @param success The success flag.
     * @param value The value being returned.
     * @param errors The error messages of any errors that occured.
     */
    constructor(success, value, ...errors) {
        this.success = success;
        this.value = value;
        this.errors = errors;
    }
    /**
     * Create a new successful result.
     * @param value The value to return.
     * @returns The newly created result.
     */
    static successResult(value) {
        return new TaskResult(true, value);
    }
    /**
     * Create a new error based result.
     * @param errors The error messsages of errors that occured.
     * @returns The newly created error result.
     */
    static errorResult(...errors) {
        return new TaskResult(false, null, ...errors);
    }
}
exports.TaskResult = TaskResult;

//# sourceMappingURL=taskresult.js.map
