import { Connection, createConnection, QueryRunner, EntityManager } from 'typeorm';
import { DataAccessLayer } from './dataaccesslayer';
import { Config } from '../config/config';
import { DatabaseConfig } from '../config/databaseconfig';
import { IUserRepository, IUserLoginRepository, IResetTokenRepository, IVerificationTokenRepository } from './models';
import { UserRepository } from './user/userrepository';
import { UserLoginRepository } from './login/userloginrepository';
import { VerificationTokenRepository } from './verificationtoken/verificationtokenrepository';
import { ResetTokenRespository } from './resettoken/resettokenrepository';

/**
 * Database implementation of the data access layer. This implementation
 * uses TypeORM to manage the mysql database.
 */
export class MysqlDataAccessLayer extends DataAccessLayer {
    /**
     * The user repository.
     */
    public userRepo: IUserRepository;

    /**
     * The user login repository.
     */
    public loginRepo: IUserLoginRepository;

    /**
     * The reset token repository.
     */
    public resetTokenRepo: IResetTokenRepository;

    /**
     * The verification token repository for
     * validating user emails.
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
     * Create a new data access layer.
     */
    constructor(){
        super();
    }

    /**
     * Initialize the data layer for use.
     */
    public async initialize(): Promise<void> {
        let dbConfig: DatabaseConfig = Config.current.database;

        this.connection = await createConnection({
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
        new EntityManager(this.connection, this.queryRunner);
        
        //set up the repos.
        this.userRepo       = this.queryRunner.manager.getCustomRepository(UserRepository);
        this.loginRepo      = this.queryRunner.manager.getCustomRepository(UserLoginRepository);
        this.resetTokenRepo = this.queryRunner.manager.getCustomRepository(ResetTokenRespository);
        this.verificationTokenRepo = this.queryRunner.manager.getCustomRepository(VerificationTokenRepository);
    }

    /**
     * Start a transaction with the database. If a transaction
     * is already in progress, an error will be thrown.
     */
    startWork(): Promise<void> {
        return this.queryRunner.startTransaction();
    }

    /**
     * Commit the current transaction. If no transaction is taking
     * place, then an error will be thrown.
     */
    commitWork(): Promise<void> {
        return this.queryRunner.commitTransaction();
    }

    /**
     * Rollback the current transaction. This reverts any work
     * committed to the database during the transcation. If no
     * transaction is in progress, then an error will be thrown.
     */
    rollbackWork(): Promise<void> {
        return this.queryRunner.rollbackTransaction();
    }
}