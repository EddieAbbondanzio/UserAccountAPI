import { User } from "../models/user";

/**
 * The service for retrieving information about users.
 */
export interface IUserService {
    /**
     * Checks if a username is available for taking.s
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    isUsernameAvailable(username: string):Promise<boolean>;

    /**
     * Check if an email is already in use by a non-deleted
     * user.
     * @param email The email to check.
     * @returns True if the email is being used.
     */
    isEmailInUse(email: string): Promise<boolean>;

    /**
     * Search for a user by their username.
     * @param username The username to look for
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    findByUsername(username: string, includeDeleted?: boolean):Promise<User>;

    /**
     * Search for a user by their unique id. This is primarily for
     * API calls.
     * @param id The numeric id of the user to look for.
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    findById(id: number, includeDeleted?: boolean):Promise<User>;

    /**
     * Update an existing user in the database.
     * @param user The user to update
     */
    update(user: User): Promise<void>;

    /**
     * Delete a user from the database
     * @param user The user to delete
     */
    delete(user: User): Promise<void>
}