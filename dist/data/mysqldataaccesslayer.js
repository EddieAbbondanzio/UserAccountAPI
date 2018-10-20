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
const dataaccesslayer_1 = require("./dataaccesslayer");
const config_1 = require("../config/config");
const userrepository_1 = require("./user/userrepository");
const userloginrepository_1 = require("./login/userloginrepository");
const verificationtokenrepository_1 = require("./verificationtoken/verificationtokenrepository");
const resettokenrepository_1 = require("./resettoken/resettokenrepository");
/**
 * Database implementation of the data access layer. This implementation
 * uses TypeORM to manage the mysql database.
 */
class MysqlDataAccessLayer extends dataaccesslayer_1.DataAccessLayer {
    /**
     * Create a new data access layer.
     */
    constructor() {
        super();
    }
    /**
     * Initialize the data layer for use.
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            let dbConfig = config_1.Config.current.database;
            this.connection = yield typeorm_1.createConnection({
                type: 'mysql',
                host: dbConfig.host,
                port: dbConfig.port,
                username: dbConfig.username,
                password: dbConfig.password,
                database: dbConfig.database,
                entities: [dbConfig.entities],
                migrations: [dbConfig.migrations],
                subscribers: [dbConfig.subscribers],
                synchronize: dbConfig.autoSchemaSync,
            });
            //Set up the query runner with a entity manager.
            this.queryRunner = this.connection.driver.createQueryRunner('master');
            new typeorm_1.EntityManager(this.connection, this.queryRunner);
            //set up the repos.
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
    startWork() {
        return this.queryRunner.startTransaction();
    }
    /**
     * Commit the current transaction. If no transaction is taking
     * place, then an error will be thrown.
     */
    commitWork() {
        return this.queryRunner.commitTransaction();
    }
    /**
     * Rollback the current transaction. This reverts any work
     * committed to the database during the transcation. If no
     * transaction is in progress, then an error will be thrown.
     */
    rollbackWork() {
        return this.queryRunner.rollbackTransaction();
    }
}
exports.MysqlDataAccessLayer = MysqlDataAccessLayer;
//# sourceMappingURL=mysqldataaccesslayer.js.map