import { AbstractRepository, EntityRepository, InsertResult } from "typeorm";
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
    public async findByUser(user: User): Promise<VerificationToken|null> {
        //Stop bad data
        if(!user){
            return null;
        }

        try {
            return await this.repository.createQueryBuilder('token')
            .leftJoinAndSelect('token.user', 'user')
            .where('token.userId = :id', user)
            .getOne();
        }
        catch(error){
            console.log('Failed to find validation token by user: ', error);
            return null;
        }
    }

    /**
     * Add a new validation token to the database.
     * @param validationToken The token to add to the database.
     * @returns True if no errors.
     */
    public async add(validationToken: VerificationToken): Promise<boolean> {
        //Stop bad data.
        if(!validationToken) {
            return false;
        }

        try {
            await this.repository.insert(validationToken);
            return true;
        }
        catch(error){
            console.log('Failed to insert validation token: ', error);
            return false;
        }
    }

    /**
     * Delete an existing validation token from the database.
     * @param validationtoken The validation token to delete.
     */
    public async delete(validationToken: VerificationToken): Promise<boolean> {
        //Stop bad data.
        if(!validationToken) {
            return false;
        }

        try {
            await this.repository.delete(validationToken);
            return true;
        }
        catch(error) {
            console.log('Failed to delete validation token: ', error);
            return false;
        }
    }
}