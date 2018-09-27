import { getConnection, Connection, Repository } from "typeorm";
import { PasswordHasher } from "../security/passwordhasher";
import {  User, UserStats, UserRepository, UserRegistration } from "../../data/datamodule";
import { Service } from "../common/service";

/**
 * A class for storing and retrieving users of the system. This provides
 * some functionality such as hashing passwords, validating credentials
 * and more.
 */
export class UserService extends Service {
    /**
     * The underlying user repository of the service.
     */
    private userRepo: UserRepository;

    /**
     * Handles generating the password hashes.
     */
    private passwordHasher: PasswordHasher;

    /**
     * Construct a new User Service for CRUD principles of the Users 
     * in the system.
     * @param userRepo The user repo to use for running the
     * service with.
     */
    constructor(connection: Connection) {
        super(connection);
        this.userRepo       = connection.getCustomRepository(UserRepository);
        this.passwordHasher = new PasswordHasher();
    }

    /**
     * Search for a user by their username.
     * @param username The username to look for
     * @param includeDeleted If we should include deleted users in the results.
     * @returns {Promise<User>} The user if found.
     */
    public async findByUsername(username: string, includeDeleted: boolean = false):Promise<User> {
        if(!username){
            return null;
        }

        return this.userRepo.findByUsername(username, includeDeleted);
    }

    /**
     * Search for a user by their unique id. This is primarily for
     * API calls.
     * @param id The numeric id of the user to look for.
     * @param includeDeleted If we should include deleted users in the results.
     * @returns {Promise<User>} The user if found.
     */
    public async findById(id: number, includeDeleted: boolean = false):Promise<User> {
        if(isNaN(id)){
            return null;
        }

        return this.userRepo.findById(id, includeDeleted);
    }
   
    /**
     * Update an existing user in the database.
     * @param user The user to update
     * @returns {Promise<boolean>} True if no errors occured.
     */
    public async update(user: User) {
        if(!user){
            return;
        }

        this.userRepo.update(user);
    }

    /**
     * Delete a user from the database
     * @param user The user to delete
     * @returns {Promise<boolean>} True if successful.
     */
    public async delete(user: User) {
        if(!user || isNaN(user.id)){
            return;
        }

        this.userRepo.delete(user);
    }

    /**
     * Register a new user with the system.
     * @param registration The user's registration.
     */
    public async register(registration: UserRegistration):Promise<boolean> {
        if(!registration.validate()){
            throw new Error("Invalid registration recieved");
        }
        else {
            let user: User = await User.FromRegistration(registration);
            await this.userRepo.add(user);
            return true;
        }
    }

    /**
     * Checks if a username is available for taking.
     * @param username The username to check for.
     */
    public async isUsernameAvailable(username: string):Promise<boolean> {
        if(!username){
            return false;
        }

        return this.userRepo.isUsernameAvailable(username);
    }
}