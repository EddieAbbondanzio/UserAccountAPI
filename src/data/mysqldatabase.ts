import { Connection, createConnection, QueryRunner, EntityManager } from 'typeorm';
import { DatabaseConfig } from '../config/databaseconfig';
import { IDatabase } from '../logic/common/idatabase';
import { IUserRepository } from '../logic/repositories/iuserrepository';
import { IUserLoginRepository } from '../logic/repositories/iuserloginrepository';
import { IResetTokenRepository } from '../logic/repositories/iresettokenrepository';
import { IVerificationTokenRepository } from '../logic/repositories/iverificationtokenrepository';
import { UserRepository } from './repositories/userrepository';
import { UserLoginRepository } from './repositories/userloginrepository';
import { ResetTokenRespository } from './repositories/resettokenrepository';
import { VerificationTokenRepository } from './repositories/verificationtokenrepository';
import { injectable } from 'inversify';

/**
 * Database implementation of the data access layer. This implementation
 * uses TypeORM to manage the mysql database.
 */
@injectable()
export class MySqlDatabase implements IDatabase {
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
    }

    /**
     * Start a transaction with the database. If a transaction
     * is already in progress, an error will be thrown.
     */
    startTransaction(): Promise<void> {
        return this.queryRunner.startTransaction();
    }

    /**
     * Commit the current transaction. If no transaction is taking
     * place, then an error will be thrown.
     */
    commitTransaction(): Promise<void> {
        return this.queryRunner.commitTransaction();
    }

    /**
     * Rollback the current transaction. This reverts any work
     * committed to the database during the transcation. If no
     * transaction is in progress, then an error will be thrown.
     */
    rollbackTransaction(): Promise<void> {
        return this.queryRunner.rollbackTransaction();
    }
}