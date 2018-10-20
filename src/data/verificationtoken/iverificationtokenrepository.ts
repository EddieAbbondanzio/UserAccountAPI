import { VerificationToken } from "./verificationtoken";
import { User } from "../user/user";
import { EntityManager } from "typeorm";

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
     * @returns True if no errors.
     */
    add(verificationToken: VerificationToken): Promise<boolean>;

    /**
     * Delete an existing validation token from the database.
     * @param validationtoken The validation token to delete.
     * @returns True if no errors.
     */
    delete(verificationToken: VerificationToken): Promise<boolean>;
}