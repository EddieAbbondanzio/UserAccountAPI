import { AbstractRepository, EntityRepository, EntityManager, Repository, DeleteResult, InsertResult } from "typeorm";
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
    public async findByUser(user: User): Promise<ResetToken> {
        //Stop bad data
        if(!user){
            return null;
        }

        return this.repository.createQueryBuilder('token')
        .leftJoinAndSelect('token.user', 'user')
        .where('token.userId = :id', {user})
        .getOne();
    }

    /**
     * Add a new reset token to the database.
     * @param resetToken The token to add to the database.
     * @param transactionManager The transaction manager to use when 
     * a database transaction is in progress.
     * @returns True if no errors.
     */
    public async add(resetToken: ResetToken, transactionManager?: EntityManager): Promise<boolean> {
        //Stop bad data.
        if(!resetToken) {
            return false;
        }

        let tokenRepo: Repository<ResetToken> = transactionManager ? transactionManager.getRepository(ResetToken) : this.repository;
        let result: InsertResult = await tokenRepo.insert(resetToken);
        
        return result.raw.affectedRowCount == 1;
    }

    /**
     * Delete an existing reset token from the database.
     * @param resetToken The reset token to delete.
     * @param transactionManager The transaction manager to use when 
     * a database transaction is in progress.
     * @returns True if no errors.
     */
    public async delete(resetToken: ResetToken, transactionManager?: EntityManager): Promise<boolean> {
        //Stop bad data.
        if(!resetToken) {
            return false;
        }

        let tokenRepo: Repository<ResetToken> = transactionManager ? transactionManager.getRepository(ResetToken) : this.repository;
        let result: DeleteResult = await tokenRepo.delete(resetToken);

        return result.raw.affectedRowCount == 1;
    }
}