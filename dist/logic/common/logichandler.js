"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class for Business logic classes to derive
 * from.
 */
class LogicHandler {
    /**
     * Create a new instance of a BLL.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(connection, serviceLocator) {
        this.connection = connection;
        this.serviceLocator = serviceLocator;
    }
    /**
     * Execute a database job within a transaction. If you need to keep
     * this focused on the executing context be sure to pass this as an
     * arrow function.
     * @param job The job to execute.
     */
    transaction(job) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.connection.transaction(function (manager) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield job(manager);
                });
            });
        });
    }
}
exports.LogicHandler = LogicHandler;
//# sourceMappingURL=logichandler.js.map