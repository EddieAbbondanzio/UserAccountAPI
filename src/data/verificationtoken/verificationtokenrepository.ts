import { AbstractRepository, EntityRepository, InsertResult, EntityManager, Repository, DeleteResult } from "typeorm";
import { VerificationToken } from "./verificationtoken";
import { User } from "../user/user";

/**
 * Storage interface for validation tokens of users. Allows for basic
 * CRUD operations with the database.
 */
@EntityRepository(VerificationToken)
export class VerificationTokenRepository extends AbstractRepository<VerificationToken> {
    /**
     * Searches for a user's validation token.
     * @param user The user to look for a validation token for.
     * @returns The token found (or null).
     */
    public async findByUser(user: User): Promise<VerificationToken> {
        //Stop bad data
        if(!user){
            return null;
        }
 
        return this.repository.createQueryBuilder('token')
        .leftJoinAndSelect('token.user', 'user')
        .where('token.userId = :id', user)
        .getOne();
    }

    /**
     * Add a new validation token to the database.
     * @param verificationToken The token to add to the database.
     * @param transactionManager The transaction manager to use when 
     * a database transaction is in progress.
     * @returns True if no errors.
     */
    public async add(verificationToken: VerificationToken, transactionManager?: EntityManager): Promise<boolean> {
        //Stop bad data.
        if(!verificationToken) {
            return false;
        }

        let tokenRepo: Repository<VerificationToken> = transactionManager ? transactionManager.getRepository(VerificationToken) : this.repository;
        let result: InsertResult = await tokenRepo.insert(verificationToken);
        
        return result.raw.affectedRowCount == 1;
    }

    /**
     * Delete an existing validation token from the database.
     * @param validationtoken The validation token to delete.
     * @param transactionManager The transaction manager to use when 
     * a database transaction is in progress.
     * @returns True if no errors.
     */
    public async delete(verificationToken: VerificationToken, transactionManager?: EntityManager): Promise<boolean> {
        //Stop bad data.
        if(!verificationToken) {
            return false;
        }

        let tokenRepo: Repository<VerificationToken> = transactionManager ? transactionManager.getRepository(VerificationToken) : this.repository;
        let result: DeleteResult = await tokenRepo.delete(verificationToken);

        return result.raw.affectedRowCount == 1;
    }
}