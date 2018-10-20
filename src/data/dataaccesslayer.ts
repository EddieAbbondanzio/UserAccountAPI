import { IUserRepository } from "./user/iuserrepository";
import { IUserLoginRepository } from "./login/iuserloginrepository";
import { IResetTokenRepository } from "./resettoken/iresettokenrepository";
import { IVerificationTokenRepository } from "./verificationtoken/iverificationtokenrepository";

/**
 * The data access layer for managing interactions
 * with the data persistance system.
 */
export abstract class DataAccessLayer {
    /**
     * The current singleton instance.
     */
    public static current: DataAccessLayer;

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

    constructor() {
        if(DataAccessLayer.current){
            throw new Error('A data access layer already exists!');
        }

        DataAccessLayer.current = this;
    }

    /**
     * Initialize the data access layer for use.
     */
    public abstract initialize(): Promise<void>;

    /**
     * Begin a new transaction with the data layer.
     * Anything done in this unit of work will not be
     * applied until commitWork() is called.
     */
    public abstract startWork(): Promise<void>;

    /**
     * Commit the work to the database that is currently
     * pending.
     */
    public abstract commitWork(): Promise<void>;

    /**
     * Rollback the work that was done during the current
     * transaction.
     */
    public abstract rollbackWork(): Promise<void>;
}