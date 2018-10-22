import { User } from "../models/user";
import { ResetToken } from "../models/resettoken";

/**
 * Interface for the database container of reset tokens.
 */
export interface IResetTokenRepository {
    /**
     * Searches for a user's reset token.
     * @param user The user to look for a reset token for.
     * @returns The token found (or null).
     */
    findByUser(user: User): Promise<ResetToken>;

    /**
     * Add a new reset token to the database.
     * @param resetToken The token to add to the database.
     * @returns True if no errors.
     */
    add(resetToken: ResetToken): Promise<boolean>;

    /**
     * Delete an existing reset token from the database.
     * @param resetToken The reset token to delete.
     * @param transactionManager The transaction manager to use when 
     * a database transaction is in progress.
     * @returns True if no errors.
     */
    delete(resetToken: ResetToken): Promise<boolean>;
}