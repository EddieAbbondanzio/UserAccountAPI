import { DatabaseConfig } from "../../config/databaseconfig";
import { IUserRepository } from "../repositories/iuserrepository";
import { IUserLoginRepository } from "../repositories/iuserloginrepository";
import { IResetTokenRepository } from "../repositories/iresettokenrepository";
import { IVerificationTokenRepository } from "../repositories/iverificationtokenrepository";

/**
 * The data persistance container. This should be able to store and retrieve
 * models that are stored in it at any time.
 */
export interface IDatabase {
    /**
     * The repository for users.
     */
    userRepo: IUserRepository;

    /**
     * The repository for user logins.
     */
    loginRepo: IUserLoginRepository;

    /**
     * The repository for reset tokens.
     */
    resetTokenRepo: IResetTokenRepository;

    /**
     * The repository for verification tokens.
     */
    verificationTokenRepo: IVerificationTokenRepository;

    /**
     * Initialize the database using the config file passed in.
     * @param config The config to use with the database.
     */
    initialize(config: DatabaseConfig): Promise<void>;

    /**
     * Start a new transaction with the database.
     */
    startTransaction(): Promise<void>;

    /**
     * Commit the current transaction.
     */
    commitTransaction(): Promise<void>;

    /**
     * Roll back the current transaction.
     */
    rollbackTransaction(): Promise<void>;
}