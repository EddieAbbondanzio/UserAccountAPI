"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Result returned back from a handler task. This allows
 * us to wrap a useful error message alongside the actual
 * value being returned.
 */
class TaskResult {
    constructor(success, errors) {
        this.success = success;
        if (typeof errors === 'string') {
            this.errors = [errors];
        }
        else {
            this.errors = errors;
        }
    }
}
exports.TaskResult = TaskResult;

//# sourceMappingURL=taskresult.js.map
