import { IDatabase } from "../../../logic/common/idatabase";
import { StubUserRepository } from "./repositories/stubuserrepository";
import { StubUserLoginRepository } from "./repositories/stubuserloginrepository";
import { DatabaseConfig } from "../../../config/databaseconfig";
import { IUserRepository } from "../../../logic/repositories/iuserrepository";
import { IUserLoginRepository } from "../../../logic/repositories/iuserloginrepository";
import { IResetTokenRepository } from "../../../logic/repositories/iresettokenrepository";
import { IVerificationTokenRepository } from "../../../logic/repositories/iverificationtokenrepository";
import { StubResetTokenRepository } from "./repositories/stubresettokenrepository";
import { VerificationTokenRepository } from "../../../data/repositories/verificationtokenrepository";

/**
 * A stub set up for mocking a real database. This is only
 * used for unit tests.
 */
export class StubDatabase implements IDatabase {
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
     * Initialize the data layer for use.
     * @param config The config to use for the database.
     */
    public async initialize(config: DatabaseConfig): Promise<void> {
        //Get the repos
        this.userRepo       = new StubUserRepository();
        this.loginRepo      = new StubUserLoginRepository();
        this.resetTokenRepo = new StubResetTokenRepository();
        this.verificationTokenRepo = new VerificationTokenRepository();
    }

    /**
     * Start a transaction with the database. If a transaction
     * is already in progress, an error will be thrown.
     */
    public async startTransaction(): Promise<void> {
    }

    /**
     * Commit the current transaction. If no transaction is taking
     * place, then an error will be thrown.
     */
    public async commitTransaction(): Promise<void> {
    }

    /**
     * Rollback the current transaction. This reverts any work
     * committed to the database during the transcation. If no
     * transaction is in progress, then an error will be thrown.
     */
    public async rollbackTransaction(): Promise<void> {
    }
}