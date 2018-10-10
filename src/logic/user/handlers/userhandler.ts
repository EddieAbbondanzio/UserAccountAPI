import { LogicHandler } from "../../common/logichandler";
import { User } from "../../../data/user/user";
import { Connection } from "typeorm";
import { IServiceLocator } from "../../common/iservicelocator";

/**
 * Handler related to users. Manages users such as finding,
 * removing, or updating them.
 */
export class UserHandler extends LogicHandler {
    /**
     * Create a new user handler for managing users.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator) {
        super(connection, serviceLocator);
    }

    /**
     * Checks if a username is available for taking.
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    public async isUsernameAvailable(username: string):Promise<boolean> {
        return false;
        // if(!username){
        //     return false;
        // }

        // try {
        //     return await this.userRepo.isUsernameAvailable(username);
        // }
        // catch(error) {
        //     console.log('UserService.isUsernameAvailable(): ', error);
        //     return false;
        // }
    }


    


    /**
     * Search for a user by their username.
     * @param username The username to look for
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    public async findByUsername(username: string, includeDeleted: boolean = false):Promise<User|null> {
        return null;
        // if(!username){
        //     return null;
        // }

        // try {
        //     return this.userRepo.findByUsername(username, includeDeleted);
        // }
        // catch(error){
        //     console.log('UserService.findByUsername(): ', error);
        //     return null;
        // }
    }

    /**
     * Search for a user by their unique id. This is primarily for
     * API calls.
     * @param id The numeric id of the user to look for.
     * @param includeDeleted If we should include deleted users in the results.
     * @returns {Promise<User>} The user if found.
     */
    public async findById(id: number, includeDeleted: boolean = false):Promise<User|null> {
        return null;
        // if(isNaN(id)){
        //     return null;
        // }

        // try {
        //     return this.userRepo.findById(id, includeDeleted);
        // }
        // catch(error){
        //     console.log('UserService.findById(): ', error);
        //     return null;
        // }
    }
   
    /**
     * Update an existing user in the database.
     * @param user The user to update
     * @returns True if no errors occured.
     */
    public async update(user: User): Promise<void> {
        return;

        // if(!user){
        //     return;
        // }

        // try {
        //     this.userRepo.update(user);
        // }
        // catch(error){
        //     console.log('UserService.update(): ', error);
        // }
    }

    /**
     * Delete a user from the database
     * @param user The user to delete
     */
    public async delete(user: User): Promise<void>  {
        //Bad data
        if(!user || isNaN(user.id) || user.isDeleted){
            return;
        }



        return null;
        // if(!user || isNaN(user.id)){
        //     return;
        // }

        // try {
        //     this.userRepo.delete(user);
        // }
        // catch(error){
        //     console.log('UserService.delete(): ', error);
        // }
    }
}