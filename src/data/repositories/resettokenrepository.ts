import { AbstractRepository, EntityRepository, EntityManager, Repository, DeleteResult, InsertResult } from "typeorm";
import { ResetToken } from "../../logic/models/resettoken";
import { IResetTokenRepository } from "../../logic/repositories/iresettokenrepository";
import { User } from "../../logic/models/user";

/**
 * Storage interface for reset tokens of users. Allows for basic CRUD
 * operations with the database.
 */
@EntityRepository(ResetToken)
export class ResetTokenRespository extends AbstractRepository<ResetToken> implements IResetTokenRepository {
    /**
     * Searches for a user's reset token.
     * @param user The user to look for a reset token for.
     * @returns The token found (or null).
     */
    public async findByUser(user: User): Promise<ResetToken> {
        //Stop bad data
        if(user == undefined){
            return undefined;
        }

        return this.repository.createQueryBuilder('token')
        .leftJoinAndSelect('token.user', 'user')
        .where('token.userId = :id', {user})
        .getOne();
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

        let result: InsertResult = await this.repository.insert(resetToken);
        
        return result.raw.affectedRowCount == 1;
    }

    /**
     * Delete an existing reset token from the database.
     * @param resetToken The reset token to delete.
     * @returns True if no errors.
     */
    public async delete(resetToken: ResetToken): Promise<boolean> {
        //Stop bad data.
        if(!resetToken) {
            return false;
        }

        let result: DeleteResult = await this.repository.delete(resetToken);

        return result.raw.affectedRowCount == 1;
    }
}