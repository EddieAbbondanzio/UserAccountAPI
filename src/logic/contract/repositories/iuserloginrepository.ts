import { UserLogin } from "../../models/userlogin";
import { User } from "../../models/user";

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
     */
    add(userLogin: UserLogin): Promise<void>;

    /**
     * Remove an existing login from the database.
     * @param userlogin The userlogin to remove from the database.
     */
    delete(userLogin: UserLogin): Promise<void>;
}