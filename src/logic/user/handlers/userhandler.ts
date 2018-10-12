import { LogicHandler } from "../../common/logichandler";
import { User } from "../../../data/user/user";
import { Connection } from "typeorm";
import { IServiceLocator } from "../../common/iservicelocator";
import { UserRepository } from "../../../data/datamodule";
import { UserDeleteValidator } from "../../validation/user/validators/userdeletevalidator";
import { ValidatorResult } from "../../validation/validatorresult";
import { UserUpdateValidator } from "../../validation/user/validators/userupdatevalidator";
import { ValidationError } from "../../validation/validationerror";

/** 
 * Handler related to users. Manages users such as finding,
 * removing, or updating them.
 */
export class UserHandler extends LogicHandler {
    /**
     * The user repository for CRUD operations with
     * the database.
     */
    private userRepo: UserRepository;

    /**
     * The validator to use when updating a user.
     */
    private updateValidator: UserUpdateValidator;

    /**
     * The validator to use when deleting a user.
     */
    private deleteValidator: UserDeleteValidator;

    /**
     * Create a new user handler for managing users.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator) {
        super(connection, serviceLocator);

        this.userRepo = connection.getCustomRepository(UserRepository);
        this.updateValidator = new UserUpdateValidator();
        this.deleteValidator = new UserDeleteValidator();
    }

    /**
     * Checks if a username is available for taking.s
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    public async isUsernameAvailable(username: string):Promise<boolean> {
        if(!username){
            throw new Error('No username was passed in.');
        }
        
        return this.userRepo.isUsernameAvailable(username);
    }

    /**
     * Search for a user by their username.
     * @param username The username to look for
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    public async findByUsername(username: string, includeDeleted?: boolean):Promise<User> {
        if(!username){
            throw new Error('No username was passed in');
        }

        return this.userRepo.findByUsername(username, includeDeleted);
    }

    /**
     * Search for a user by their unique id. This is primarily for
     * API calls.
     * @param id The numeric id of the user to look for.
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    public async findById(id: number, includeDeleted: boolean = false):Promise<User> {
        if(isNaN(id)){
            throw new Error('No user id passed in.');
        }
        
        return this.userRepo.findById(id, includeDeleted);
    }

    /**
     * Update an existing user in the database.
     * @param user The user to update
     * @returns True if no errors occured.
     */
    public async update(user: User): Promise<boolean> {
        if(!user || isNaN(user.id)){
            throw new Error('No user passed in, or user has no id.');
        }
        
        let validatorResult: ValidatorResult = this.updateValidator.validate(user);

        if(!validatorResult.isValid){
            throw new ValidationError('Failed to update user.', validatorResult);
        }
        
        return this.userRepo.update(user);
    }

    /**
     * Delete a user from the database
     * @param user The user to delete
     * @returns True if no errors occured.
     */
    public async delete(user: User): Promise<boolean> {
        if(!user || isNaN(user.id)){
            throw new Error('No user passed in, or user has no id.');
        }

        let validatorResult: ValidatorResult = this.deleteValidator.validate(user);

        if(!validatorResult.isValid){
            throw new ValidationError('Failed to delete user.', validatorResult);
        }

        return this.userRepo.delete(user);
    }
}