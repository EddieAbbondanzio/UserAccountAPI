import { Connection, createConnection, QueryRunner, EntityManager } from 'typeorm';
import { DatabaseConfig } from '../config/databaseconfig';
import { UserRepository } from './repositories/userrepository';
import { UserLoginRepository } from './repositories/userloginrepository';
import { ResetTokenRespository } from './repositories/resettokenrepository';
import { VerificationTokenRepository } from './repositories/verificationtokenrepository';
import { Database } from '../logic/common/database';
import { IUserRepository } from '../logic/contract/repositories/iuserrepository';
import { IUserLoginRepository } from '../logic/contract/repositories/iuserloginrepository';
import { IResetTokenRepository } from '../logic/contract/repositories/iresettokenrepository';
import { IVerificationTokenRepository } from '../logic/contract/repositories/iverificationtokenrepository';
import { InvalidOperationError } from '../common/error/types/invalidoperation';
import { injectable } from 'inversify';

/**
 * Database implementation of the data access layer. This implementation
 * uses TypeORM to manage the mysql database.
 */
@injectable()
export class MySqlDatabase extends Database {
    /**
     * The repository for users.
     */
    public userRepo: IUserRepository;

    /**
     * The repository for user logins.
     */
    public loginRepo: IUserLoginRepository;

    /**
     * The repository for reset tokens.
     */
    public resetTokenRepo: IResetTokenRepository;

    /**
     * The repository for verification tokens.
     */
    public verificationTokenRepo: IVerificationTokenRepository;

    /**
     * The database connection.
     */
    private connection: Connection;

    /**
     * The query runner that manages interactive
     * with the database.
     */
    private queryRunner: QueryRunner;

    /**
     * Flag to track if a transaction is in progress
     * or not.
     */
    private inTransaction: boolean;

    /**
     * Initialize the data layer for use.
     * @param config The config to use for the database.
     */
    public async initialize(config: DatabaseConfig): Promise<void> {

        this.connection = await createConnection({
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
        new EntityManager(this.connection, this.queryRunner);

        //Get the repos
        this.userRepo = this.queryRunner.manager.getCustomRepository(UserRepository);
        this.loginRepo = this.queryRunner.manager.getCustomRepository(UserLoginRepository);
        this.resetTokenRepo = this.queryRunner.manager.getCustomRepository(ResetTokenRespository);
        this.verificationTokenRepo = this.queryRunner.manager.getCustomRepository(VerificationTokenRepository);

        this.inTransaction = false;
    }

    /**
     * Start a transaction with the database. If a transaction
     * is already in progress, an error will be thrown.
     */
    public async startTransaction(): Promise<void> {
        if (this.inTransaction) {
            throw new InvalidOperationError('A transaction is already in progress');
        }

        this.inTransaction = true;
        return this.queryRunner.startTransaction();
    }

    /**
     * Commit the current transaction. If no transaction is taking
     * place, then an error will be thrown.
     */
    public async commitTransaction(): Promise<void> {
        if (!this.inTransaction) {
            throw new InvalidOperationError('A transaction was not started');
        }

        this.inTransaction = false;
        return this.queryRunner.commitTransaction();
    }

    /**
     * Rollback the current transaction. This reverts any work
     * committed to the database during the transcation. If no
     * transaction is in progress, then an error will be thrown.
     */
    public async rollbackTransaction(): Promise<void> {
        if (!this.inTransaction) {
            throw new InvalidOperationError('A transaction was not started');
        }

        this.inTransaction = false;
        return this.queryRunner.rollbackTransaction();
    }

    /**
     * If the database is currently in a transaction or not.
     * @returns True if a transaction is active.
     */
    public isInTransaction(): boolean {
        return this.inTransaction;
    }
}