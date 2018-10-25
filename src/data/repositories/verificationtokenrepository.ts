import { AbstractRepository, EntityRepository, InsertResult, EntityManager, Repository, DeleteResult, QueryFailedError } from "typeorm";
import { VerificationToken } from "../../logic/models/verificationtoken";
import { IVerificationTokenRepository } from "../../logic/repositories/iverificationtokenrepository";
import { User } from "../../logic/models/user";
import { NullArgumentError } from "../../common/errors/nullargumenterror";
import { MySqlErrorCode } from "../mysqlerror";
import { DuplicateEntityError } from "../../common/errors/duplicateentityerror";

/**
 * Storage interface for validation tokens of users. Allows for basic
 * CRUD operations with the database.
 */
@EntityRepository(VerificationToken)
export class VerificationTokenRepository extends AbstractRepository<VerificationToken> implements IVerificationTokenRepository {
    /**
     * Searches for a user's validation token.
     * @param user The user to look for a validation token for.
     * @returns The token found (or null).
     */
    public async findByUser(user: User): Promise<VerificationToken> {
        if(user == null){
            throw new NullArgumentError('user');
        }
 
        return this.repository.createQueryBuilder('token')
        .leftJoinAndSelect('token.user', 'user')
        .where('token.userId = :id', user)
        .getOne();
    }

    /**
     * Add a new validation token to the database.
     * @param verificationToken The token to add to the database.
     */
    public async add(verificationToken: VerificationToken): Promise<void> {
        if(verificationToken == null) {
            throw new NullArgumentError('verificationToken');
        }

        try {
            await this.repository.insert(verificationToken);
        }
        catch(error) {
            //Is it an error we know about?
            if(error instanceof QueryFailedError){
                let errorCode: MySqlErrorCode = (error as any).errno;

                if(errorCode == MySqlErrorCode.DuplicateKey){
                    throw new DuplicateEntityError('A verification token for the user already exists.');
                }
            }

            //Pass it higher up, no clue what it is.
            throw error;
        }
    }

    /**
     * Delete an existing validation token from the database.
     * @param validationtoken The validation token to delete.
     */
    public async delete(verificationToken: VerificationToken): Promise<void> {
        if(verificationToken == null) {
            throw new NullArgumentError('verificationToken');
        }

        await this.repository.delete(verificationToken);
    }
}