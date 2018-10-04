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
     * A new user wishes to join. Process their registration
     * and attempt to add them to the system.
     * @param registration The user's registration.
     */
    public async registerNewUser(registration: UserRegistration): Promise<boolean> {
        return false;
    }

    /**
     * User forgot their username and wants it emailed to them.
     * @param email The user's email to send it to.
     */
    public async emailUserTheirUsername(email: string): Promise<void> {

    }

    /**
     * User forgot their email and wants a temporary access password
     * emailed to them. This will not remove their existing password.
     * @param username The username of the user to email.
     */
    public async emailUserTempPassword(username: string): Promise<void> {

    }

    /**
     * Checks if a username is available for taking.
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    public async isUsernameAvailable(username: string):Promise<boolean> {
        if(!username){
            return false;
        }

        try {
            return await this.userRepo.isUsernameAvailable(username);
        }
        catch(error) {
            console.log('UserService.isUsernameAvailable(): ', error);
            return false;
        }
    }












    /**
     * Search for a user by their username.
     * @param username The username to look for
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    public async findByUsername(username: string, includeDeleted: boolean = false):Promise<User|null> {
        if(!username){
            return null;
        }

        try {
            return this.userRepo.findByUsername(username, includeDeleted);
        }
        catch(error){
            console.log('UserService.findByUsername(): ', error);
            return null;
        }
    }

    /**
     * Search for a user by their unique id. This is primarily for
     * API calls.
     * @param id The numeric id of the user to look for.
     * @param includeDeleted If we should include deleted users in the results.
     * @returns {Promise<User>} The user if found.
     */
    public async findById(id: number, includeDeleted: boolean = false):Promise<User|null> {
        if(isNaN(id)){
            return null;
        }

        try {
            return this.userRepo.findById(id, includeDeleted);
        }
        catch(error){
            console.log('UserService.findById(): ', error);
            return null;
        }
    }
   
    /**
     * Update an existing user in the database.
     * @param user The user to update
     * @returns True if no errors occured.
     */
    public async update(user: User): Promise<void> {
        if(!user){
            return;
        }

        try {
            this.userRepo.update(user);
        }
        catch(error){
            console.log('UserService.update(): ', error);
        }
    }

    /**
     * Delete a user from the database
     * @param user The user to delete
     */
    public async delete(user: User): Promise<void>  {
        if(!user || isNaN(user.id)){
            return;
        }

        try {
            this.userRepo.delete(user);
        }
        catch(error){
            console.log('UserService.delete(): ', error);
        }
    }

    /**
     * Register a new user with the system.
     * @param registration The user's registration.
     */
    public async register(registration: UserRegistration):Promise<boolean> {
        if(!registration.validate()){
            return false;
        }
        else {
            try {
                let user: User = await User.FromRegistration(registration);
                await this.userRepo.add(user);
                return true;
            }
            catch(error) {
                console.log('UserService.register(): Failed to register new user: ', error);
                return false;
            }
        }
    }

}