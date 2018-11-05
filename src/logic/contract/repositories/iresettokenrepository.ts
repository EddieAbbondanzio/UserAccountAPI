import { ResetToken } from "../../models/resettoken";
import { User } from "../../models/user";

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
     */
    add(resetToken: ResetToken): Promise<void>;

    /**
     * Delete an existing reset token from the database.
     * @param resetToken The reset token to delete.
     * @param transactionManager The transaction manager to use when 
     * a database transaction is in progress.
     */
    delete(resetToken: ResetToken): Promise<void>;
    
    /**
     * Delete all existing validation tokens from the database
     * for a user.
     * @param user The user or id to remove all tokens for.
     */
    deleteForUser(user: User|number): Promise<void>;
}