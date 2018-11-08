import { AbstractRepository, EntityRepository, EntityManager, Repository, InsertResult, DeleteResult, QueryFailedError } from 'typeorm';
import { User } from '../../logic/models/user';
import { UserLogin } from '../../logic/models/userlogin';
import { ArgumentError } from '../../common/error/types/argumenterror';
import { NullArgumentError } from '../../common/error/types/nullargumenterror';
import { MySqlErrorCode } from '../mysqlerror';
import { DuplicateError } from '../../common/error/types/duplicateerror';
import { IUserLoginRepository } from '../../logic/contract/repositories/iuserloginrepository';

/**
 * Storage interface for logins of users. Allows for adding a new
 * login of a user, or removing every
 */
@EntityRepository(UserLogin)
export class UserLoginRepository extends AbstractRepository<UserLogin> implements IUserLoginRepository {
    /**
     * Search for a login for a specific user.
     * @param user The user to look for a login for.
     * @returns The login found (or null).
     */
    public async findByUser(user: User|number): Promise<UserLogin> {
        if(user == null) {
            throw new NullArgumentError('user');
        }

        if(user instanceof User) {
            if(isNaN(user.id)){
                throw new ArgumentError('user', 'does not have an id');
            }

            return this.repository.createQueryBuilder('login')
            .leftJoinAndSelect('login.user', 'user')
            .where('login.userId = :id', user)
            .getOne();
        }
        else {
            return this.repository.createQueryBuilder('login')
            .leftJoinAndSelect('login.user', 'user')
            .where('login.userId = :id', {id: user})
            .getOne();
        }
    }

    /**
     * Add a new user login to the database.
     * @param userLogin The userlogin to add to the database.
     */
    public async add(userLogin: UserLogin): Promise<void> {
        if(userLogin == null) {
            throw new NullArgumentError('userLogin');
        }

        try {
            await this.repository.insert(userLogin);
        }
        catch(error) {
            //Is it an error we know about?
            if(error instanceof QueryFailedError){
                let errorCode: MySqlErrorCode = (error as any).errno;

                if(errorCode == MySqlErrorCode.DuplicateKey){
                    throw new DuplicateError('A login for the user already exists');
                }
            }

            //Pass it higher up, no clue what it is.
            throw error;
        }
    }

    /**
     * Remove an existing login from the database.
     * @param userlogin The userlogin to remove from the database.
     */
    public async delete(userlogin: UserLogin): Promise<void> {
        if(userlogin == null) {
            throw new NullArgumentError('userLogin');
        }

        await this.repository.delete(userlogin);
    }

    /**
     * Delete all logins for a user.
     * @param user The user to remove all logins for.
     */
    public async deleteForUser(user: User|number): Promise<void> {
        if(typeof user === 'number') {
            await this.repository.createQueryBuilder()
            .delete()
            .where('userId = :id', {id: user})
            .execute();
        }
        else {
            await this.repository.createQueryBuilder()
            .delete()
            .where('userId = :id', user)
            .execute();
        }
    }
}