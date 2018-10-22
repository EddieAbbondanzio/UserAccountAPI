import { UserLogin } from "../models/userlogin";
import { User } from "../models/user";

/**
 * Interface for the storage container of UserLogins.
 */
export interface IUserLoginRepository {
    /**
     * Search for a login for a specific user.
     * @param user The user to look for a login for.
     * @returns The login found (or null).
     */
    findByUser(user: User): Promise<UserLogin>;

    /**
     * Add a new user login to the database.
     * @param userLogin The userlogin to add to the database.
     * @returns True if no errors.
     */
    add(userLogin: UserLogin): Promise<boolean>;

    /**
     * Remove an existing login from the database.
     * @param userlogin The userlogin to remove from the database.
     * @returns True if no errors.
     */
    delete(userLogin: UserLogin): Promise<boolean>;

    /**
     * Remove an existing login from the database via it's id.
     * @param id The login id to look for.
     * @returns True if no errors.
     */
    deleteById(id: number): Promise<boolean>;
}