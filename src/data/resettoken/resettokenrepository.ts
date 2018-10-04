import { AbstractRepository, EntityRepository } from "typeorm";
import { ResetToken } from "./resettoken";
import { User } from "../user/user";

/**
 * Storage interface for reset tokens of users. Allows for basic CRUD
 * operations with the database.
 */
@EntityRepository(ResetToken)
export class ResetTokenRespository extends AbstractRepository<ResetToken> {
    /**
     * Searches for a user's reset token.
     * @param user The user to look for a reset token for.
     * @returns The token found (or null).
     */
    public async findByUser(user: User): Promise<ResetToken|null> {
        //Stop bad data
        if(!user){
            return null;
        }

        try {
            return await this.repository.createQueryBuilder('token')
            .leftJoinAndSelect('token.user', 'user')
            .where('token.userId = :id', {user})
            .getOne();
        }
        catch(error){
            console.log('Failed to find reset token by user: ', error);
            return null;
        }
    }

    /**
     * Add a new reset token to the database.
     * @param resetToken The token to add to the database.
     * @returns True if no errors.
     */
    public async add(resetToken: ResetToken): Promise<boolean> {
        //Stop bad data.
        if(!resetToken) {
            return false;
        }

        try {
            await this.repository.insert(resetToken);
            return true;
        }
        catch(error){
            console.log('Failed to insert reset token: ', error);
            return false;
        }
    }

    /**
     * Delete an existing reset token from the database.
     * @param resetToken The reset token to delete.
     */
    public async delete(resetToken: ResetToken): Promise<boolean> {
        //Stop bad data.
        if(!resetToken) {
            return false;
        }

        try {
            await this.repository.delete(resetToken);
            return true;
        }
        catch(error) {
            console.log('Failed to delete reset token: ', error);
            return false;
        }
    }
}