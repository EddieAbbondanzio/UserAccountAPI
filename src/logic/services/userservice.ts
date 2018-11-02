import { ValidatorResult } from "../validation/validatorresult";
import { User } from "../models/user";
import { TextEmail } from "../email/types/textemail";
import { ResetToken } from "../models/resettoken";
import { ValidationError } from "../validation/validationerror";
import { UserUpdateValidator } from "../validation/user/validators/userupdatevalidator";
import { UserDeleteValidator } from "../validation/user/validators/userdeletevalidator";
import { Service } from "../common/service";
import { Database } from "../common/database";
import { ServiceType } from "../common/servicetype";
import { ArgumentError } from "../../common/error/types/argumenterror";
import { StringUtils } from "../../util/stringutils";
import { UserUsernameValidatorRule } from "../validation/user/rules/userusernamevalidatorrule";
import { ValidatorRuleResult } from "../validation/validatorruleresult";
import { NullArgumentError } from "../../common/error/types/nullargumenterror";
import { UsernameValidator } from "../validation/user/validators/usernamevalidator";

/**
 * The user service for retrieving users from the system.
 */
export class UserService extends Service{
    /**
     * The type of service it is.
     */
    readonly serviceType: ServiceType = ServiceType.User;

    /**
     * The validator to validate a user being updated.
     */
    private userUpdateValidator: UserUpdateValidator;

    /**
     * The validator to validate a user being deleted.
     */
    private userDeleteValidator: UserDeleteValidator;

    /**
     * Create a new user service.
     * @param database The current database.
     */
    constructor(database: Database) {
        super(database);
        
        this.userUpdateValidator = new UserUpdateValidator();
        this.userDeleteValidator = new UserDeleteValidator();
    }
    
    /**
     * Checks if a username is available for taking.s
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    public async isUsernameAvailable(username: string):Promise<boolean> {
        let usernameValRule: UserUsernameValidatorRule = new UserUsernameValidatorRule();

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
     * Update an existing user in the database.
     * @param user The user to update
     */
    public async update(user: User): Promise<void> {
        if(!user || isNaN(user.id)){
            throw new ArgumentError('user');
        }
        
        let validatorResult: ValidatorResult = this.userUpdateValidator.validate(user);

        if(!validatorResult.isValid){
            throw new ValidationError('Failed to update user.', validatorResult);
        }
        
        await this.database.userRepo.update(user);
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