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
 * Base class for any service that works off the database.
 * A cache of the connection is kept and can be accessed
 * via this.connection.
 */
class Service {
    /**
     * Create a new service to the db.
     * @param connection The connection to cache.
     */
    constructor(connection) {
        this.connection = connection;
    }
    /**
     * Execute a database job within a transaction.
     * @param job The job to execute.
     */
    transaction(job) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield job(manager);
            }));
        });
    }
}
exports.Service = Service;

//# sourceMappingURL=service.js.map
