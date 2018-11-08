import { ValidatorResult } from "../validation/validatorresult";
import { User } from "../models/user";
import { ValidationError } from "../validation/validationerror";
import { UserDeleteValidator } from "../validation/user/validators/userdeletevalidator";
import { Database } from "../common/database";
import { ServiceType } from "../common/servicetype";
import { ArgumentError } from "../../common/error/types/argumenterror";
import { StringUtils } from "../../util/stringutils";
import { UsernameValidatorRule } from "../validation/user/rules/usernamevalidatorrule";
import { NullArgumentError } from "../../common/error/types/nullargumenterror";
import { UsernameValidator } from "../validation/user/validators/usernamevalidator";
import { DatabaseService } from "../common/databaseservice";
import { UserRegistration } from "../common/userregistration";
import { UserRegistrationValidator } from "../validation/user/validators/userregistrationvalidator";
import { VerificationToken } from "../models/verificationtoken";
import { IEmailSender } from "../email/iemailsender";
import { ErrorHandler } from "../../common/error/errorhandler";
import { QueryFailedError } from "typeorm";
import { DuplicateError } from "../../common/error/types/duplicateerror";
import { injectable, inject } from "inversify";
import { IOC_TYPES } from "../../common/ioc/ioctypes";

/**
 * The user service for retrieving users from the system.
 */
@injectable()
export class UserService extends DatabaseService {
    /**
     * The type of service it is.
     */
    readonly serviceType: ServiceType = ServiceType.User;

    /**
     * The validator to validate a user being deleted.
     */
    private userDeleteValidator: UserDeleteValidator;

    /**
     * The validator to validate users being created.
     */
    private userRegistrationValidator: UserRegistrationValidator;

    /**
     * The service for sending emails.
     */
    private emailSender: IEmailSender;

    /**
     * Create a new user service.
     * @param database The current database.
     */
    constructor(@inject(IOC_TYPES.Database) database: Database) {
        super(database);
        
        this.userDeleteValidator = new UserDeleteValidator();
        this.userRegistrationValidator = new UserRegistrationValidator();
    }
    
    /**
     * Checks if a username is available for taking.s
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    public async isUsernameAvailable(username: string):Promise<boolean> {
        let usernameValRule: UsernameValidatorRule = new UsernameValidatorRule();

        if(username == null){
            throw new NullArgumentError('username');
        }
        else {
            let validatorResult: ValidatorResult = new UsernameValidator().validate(username);

            if(validatorResult.isValid) {
                return this.database.userRepo.isUsernameAvailable(username);
            }   
            else {
                throw new ValidationError('Username is not valid', validatorResult);
            }
        }
    }

    /**
     * Check if an email is already in use by a non-deleted
     * user.
     * @param email The email to check.
     * @returns True if the email is being used.
     */
    public async isEmailInUse(email: string): Promise<boolean> {
        if(email == null){
            throw new NullArgumentError('email');
        }

        return this.database.userRepo.isEmailInUse(email);
    }

    public async registerNewUser(registration: UserRegistration): Promise<User> {
        if (registration == null) {
            throw new NullArgumentError('registration');
        }

        //Is the user even valid?
        let validatorResult: ValidatorResult = this.userRegistrationValidator.validate(registration);

        if (!validatorResult.isValid) {
            throw new ValidationError('Failed to register new user.', validatorResult);
        }

        //Generate the user
        let user: User = await User.fromRegistration(registration);
        let vToken: VerificationToken;

        try { 
            await this.database.userRepo.add(user);
            return user;
        }
        catch (error) {
            if (this.database.isInTransaction()) {
                await this.database.rollbackTransaction();
            }

            new ErrorHandler(error)
            .catch(QueryFailedError, (error: QueryFailedError) => {
                if(error.message.includes('ER_DUP_ENTRY')) {
                    throw new DuplicateError('Username or email is already in use.');
                }
            })
            .otherwiseRaise();

            return null;
        }
    }

    /**
     * Search for a user by their username.
     * @param username The username to look for
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    public async findByUsername(username: string, includeDeleted?: boolean):Promise<User> {
        if(username == null){
            throw new NullArgumentError('username');
        }

        return this.database.userRepo.findByUsername(username, includeDeleted);
    }

    /**
     * Search for a user by their unique id. This is primarily for
     * API calls.
     * @param id The numeric id of the user to look for.
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    public async findById(id: number, includeDeleted?: boolean):Promise<User> {
        if(isNaN(id)){
            throw new ArgumentError('id');
        }
        
        return this.database.userRepo.findById(id, includeDeleted);
    }

    /**
     * Search for a user via their email.
     * @param email The email to look for.
     * @param includeDeleted If deleted users should be included in the result.
     */
    public async findByEmail(email: string, includeDeleted?: boolean): Promise<User> {
        if(StringUtils.isBlank(email)){
            throw new ArgumentError('email');
        }

        return this.database.userRepo.findByEmail(email, includeDeleted);
    }

    /**
     * Delete a user from the database
     * @param user The user to delete
     */
    public async delete(user: User): Promise<void> {
        if(!user || isNaN(user.id)){
            throw new ArgumentError('user');
        }

        let validatorResult: ValidatorResult = this.userDeleteValidator.validate(user);

        if(!validatorResult.isValid){
            throw new ValidationError('Failed to delete user.', validatorResult);
        }

        await this.database.userRepo.delete(user);
    }
}