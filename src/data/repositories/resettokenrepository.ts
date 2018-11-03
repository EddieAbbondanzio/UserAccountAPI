import { AbstractRepository, EntityRepository, EntityManager, Repository, DeleteResult, InsertResult, QueryFailedError } from "typeorm";
import { ResetToken } from "../../logic/models/resettoken";
import { User } from "../../logic/models/user";
import { NullArgumentError } from "../../common/error/types/nullargumenterror";
import { ArgumentError } from "../../common/error/types/argumenterror";
import { MySqlErrorCode } from "../mysqlerror";
import { DuplicateError } from "../../common/error/types/duplicateerror";
import { IResetTokenRepository } from "../../logic/contract/repositories/iresettokenrepository";

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
        if(user == null){
            throw new NullArgumentError('user');
        }
        else if(isNaN(user.id)){
            throw new ArgumentError('user', 'does not have an id');
        }

        return this.repository.createQueryBuilder('token')
        .leftJoinAndSelect('token.user', 'user')
        .where('token.userId = :id', user)
        .getOne();
    }

    /**
     * Add a new reset token to the database.
     * @param resetToken The token to add to the database.
     * @returns True if no errors.
     */
    public async add(resetToken: ResetToken): Promise<void> {
        if(resetToken == null) {
            throw new NullArgumentError('resetToken');
        }
        else if(resetToken.user == null){
            throw new ArgumentError('resetToken', 'no user for this token');
        }
        else if(isNaN(resetToken.user.id)) {
            throw new ArgumentError('resetToken', 'no id on the user of the token');
        }

        //Should more than one be allowed per user?
        try {
            await this.repository.insert(resetToken);
        }
        catch(error){
            //Is it an error we know about?
            if(error instanceof QueryFailedError){
                let errorCode: MySqlErrorCode = (error as any).errno;

                if(errorCode == MySqlErrorCode.DuplicateKey){
                    throw new DuplicateError('A reset token for the user already exists.');
                }
            }

            //Pass it higher up, no clue what it is.
            throw error;
        }
    }

    /**
     * Delete an existing reset token from the database.
     * @param resetToken The reset token to delete.
     * @returns True if no errors.
     */
    public async delete(resetToken: ResetToken): Promise<void> {
        if(resetToken == null) {
            throw new NullArgumentError('resetToken');
        }
        else if(resetToken.user == null){
            throw new ArgumentError('resetToken', 'no user for this token');
        }
        else if(isNaN(resetToken.user.id)) {
            throw new ArgumentError('resetToken', 'no id on the user of the token');
        }

        await this.repository.delete(resetToken);
    }
}