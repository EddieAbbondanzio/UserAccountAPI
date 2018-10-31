import { DatabaseConfig } from "../../config/databaseconfig";
import { IUserRepository } from "../repositories/iuserrepository";
import { IUserLoginRepository } from "../repositories/iuserloginrepository";
import { IResetTokenRepository } from "../repositories/iresettokenrepository";
import { IVerificationTokenRepository } from "../repositories/iverificationtokenrepository";

/**
 * The data persistance container. This should be able to store and retrieve
 * models that are stored in it at any time.
 */
export abstract class Database {
    /**
     * The singleton database reference.
     */
    public static current: Database;

    /**
     * The repository for users.
     */
    public abstract userRepo: IUserRepository;

    /**
     * The repository for user logins.
     */
    public abstract loginRepo: IUserLoginRepository;

    /**
     * The repository for reset tokens.
     */
    public abstract resetTokenRepo: IResetTokenRepository;

    /**
     * The repository for verification tokens.
     */
    public abstract verificationTokenRepo: IVerificationTokenRepository;

    /**
     * Initialize the database using the config file passed in.
     * @param config The config to use with the database.
     */
    public abstract initialize(config: DatabaseConfig): Promise<void>;

    /**
     * Start a new transaction with the database.
     */
    public abstract startTransaction(): Promise<void>;

    /**
     * Commit the current transaction.
     */
    public abstract commitTransaction(): Promise<void>;

    /**
     * Roll back the current transaction.
     */
    public abstract rollbackTransaction(): Promise<void>;

    /**
     * Create a new database.
     */
    constructor(){
        Database.current = this;
    }
}