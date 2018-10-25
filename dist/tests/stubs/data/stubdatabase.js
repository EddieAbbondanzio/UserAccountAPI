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
const stubuserrepository_1 = require("./repositories/stubuserrepository");
const stubuserloginrepository_1 = require("./repositories/stubuserloginrepository");
const stubresettokenrepository_1 = require("./repositories/stubresettokenrepository");
const verificationtokenrepository_1 = require("../../../data/repositories/verificationtokenrepository");
/**
 * A stub set up for mocking a real database. This is only
 * used for unit tests.
 */
class StubDatabase {
    /**
     * Initialize the data layer for use.
     * @param config The config to use for the database.
     */
    initialize(config) {
        return __awaiter(this, void 0, void 0, function* () {
            //Get the repos
            this.userRepo = new stubuserrepository_1.StubUserRepository();
            this.loginRepo = new stubuserloginrepository_1.StubUserLoginRepository();
            this.resetTokenRepo = new stubresettokenrepository_1.StubResetTokenRepository();
            this.verificationTokenRepo = new verificationtokenrepository_1.VerificationTokenRepository();
        });
    }
    /**
     * Start a transaction with the database. If a transaction
     * is already in progress, an error will be thrown.
     */
    startTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * Commit the current transaction. If no transaction is taking
     * place, then an error will be thrown.
     */
    commitTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * Rollback the current transaction. This reverts any work
     * committed to the database during the transcation. If no
     * transaction is in progress, then an error will be thrown.
     */
    rollbackTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.StubDatabase = StubDatabase;
//# sourceMappingURL=stubdatabase.js.map