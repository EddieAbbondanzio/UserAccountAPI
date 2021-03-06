import { VerificationToken } from "../../models/verificationtoken";
import { User } from "../../models/user";

/**
 * Interface for the container to store verification
 *  tokens with.
 */
export interface IVerificationTokenRepository {
    /**
     * Searches for a user's validation token.
     * @param user The user to look for a validation token for.
     * @returns The token found (or null).
     */
    findByUser(user: User): Promise<VerificationToken>;

    /**
     * Add a new validation token to the database.
     * @param verificationToken The token to add to the database.
     */
    add(verificationToken: VerificationToken): Promise<void>;

    /**
     * Delete an existing validation token from the database.
     * @param validationtoken The validation token to delete.
     */
    delete(verificationToken: VerificationToken): Promise<void>;

    /**
     * Delete all existing validation tokens from the database
     * for a user.
     * @param user The user or id to remove all tokens for.
     */
    deleteForUser(user: User|number): Promise<void>;
}