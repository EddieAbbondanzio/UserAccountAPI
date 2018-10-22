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
const typeorm_1 = require("typeorm");
const userrepository_1 = require("./repositories/userrepository");
const userloginrepository_1 = require("./repositories/userloginrepository");
const resettokenrepository_1 = require("./repositories/resettokenrepository");
const verificationtokenrepository_1 = require("./repositories/verificationtokenrepository");
/**
 * Database implementation of the data access layer. This implementation
 * uses TypeORM to manage the mysql database.
 */
class MySqlDatabase {
    /**
     * Initialize the data layer for use.
     * @param config The config to use for the database.
     */
    initialize(config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield typeorm_1.createConnection({
                type: 'mysql',
                host: config.host,
                port: config.port,
                username: config.username,
                password: config.password,
                database: config.database,
                entities: [config.entities],
                migrations: [config.migrations],
                subscribers: [config.subscribers],
                synchronize: config.autoSchemaSync,
            });
            //Set up the query runner with a entity manager.
            this.queryRunner = this.connection.driver.createQueryRunner('master');
            new typeorm_1.EntityManager(this.connection, this.queryRunner);
            //Get the repos
            this.userRepo = this.queryRunner.manager.getCustomRepository(userrepository_1.UserRepository);
            this.loginRepo = this.queryRunner.manager.getCustomRepository(userloginrepository_1.UserLoginRepository);
            this.resetTokenRepo = this.queryRunner.manager.getCustomRepository(resettokenrepository_1.ResetTokenRespository);
            this.verificationTokenRepo = this.queryRunner.manager.getCustomRepository(verificationtokenrepository_1.VerificationTokenRepository);
        });
    }
    /**
     * Start a transaction with the database. If a transaction
     * is already in progress, an error will be thrown.
     */
    startTransaction() {
        return this.queryRunner.startTransaction();
    }
    /**
     * Commit the current transaction. If no transaction is taking
     * place, then an error will be thrown.
     */
    commitTransaction() {
        return this.queryRunner.commitTransaction();
    }
    /**
     * Rollback the current transaction. This reverts any work
     * committed to the database during the transcation. If no
     * transaction is in progress, then an error will be thrown.
     */
    rollbackTransaction() {
        return this.queryRunner.rollbackTransaction();
    }
}
exports.MySqlDatabase = MySqlDatabase;
//# sourceMappingURL=mysqldatabase.js.map