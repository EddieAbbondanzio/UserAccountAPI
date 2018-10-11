import { LogicHandler } from "../../common/logichandler";
import { User } from "../../../data/user/user";
import { Connection } from "typeorm";
import { IServiceLocator } from "../../common/iservicelocator";
import { UserRepository } from "../../../data/datamodule";
import { TaskResult } from "../../common/results/taskresult";

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
     * Create a new user handler for managing users.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator) {
        super(connection, serviceLocator);

        this.userRepo = connection.getCustomRepository(UserRepository);
    }

    /**
     * Checks if a username is available for taking.
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    public async isUsernameAvailable(username: string):Promise<TaskResult<boolean>> {
        if(!username){
            return TaskResult.errorResult('No username was passed in.');
        }
        else {
            let isAvailable:boolean = await this.userRepo.isUsernameAvailable(username);
            return TaskResult.successResult(isAvailable);
        }
    }

    /**
     * Search for a user by their username.
     * @param username The username to look for
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    public async findByUsername(username: string, includeDeleted?: boolean):Promise<TaskResult<User>> {
        if(!username){
            return TaskResult.errorResult('No username was passed in');
        }
        else {
            let user: User = await this.userRepo.findByUsername(username, includeDeleted);
            return TaskResult.successResult(user);
        }
    }

    /**
     * Search for a user by their unique id. This is primarily for
     * API calls.
     * @param id The numeric id of the user to look for.
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    public async findById(id: number, includeDeleted: boolean = false):Promise<TaskResult<User>> {
        if(isNaN(id)){
            return TaskResult.errorResult('No user id passed in.');
        }
        else {
            let user: User = await this.userRepo.findById(id, includeDeleted);
            return TaskResult.successResult(user);
        }
    }

    /**
     * Update an existing user in the database.
     * @param user The user to update
     * @returns True if no errors occured.
     */
    public async update(user: User): Promise<boolean> {
        if(!user || isNaN(user.id) || user.isDeleted){
            return false;
        }
        else {
            return await this.userRepo.update(user);
        }
    }

    /**
     * Delete a user from the database
     * @param user The user to delete
     * @returns True if no errors occured.
     */
    public async delete(user: User): Promise<TaskResult<boolean>> {
        //Bad data
        if(!user || isNaN(user.id)){
            return TaskResult.errorResult('No user passed in, or user has no id.');
        }
        else {
            await this.userRepo.delete(user);
            return TaskResult.successResult(true);
        }
    }
}