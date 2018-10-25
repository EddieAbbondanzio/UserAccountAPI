import { AbstractRepository, EntityRepository, EntityManager, Repository, InsertResult, DeleteResult, QueryFailedError } from 'typeorm';
import { User } from '../../logic/models/user';
import { UserLogin } from '../../logic/models/userlogin';
import { IUserLoginRepository } from '../../logic/repositories/iuserloginrepository';
import { ArgumentError } from '../../common/errors/argumenterror';
import { NullArgumentError } from '../../common/errors/nullargumenterror';
import { MySqlErrorCode } from '../mysqlerror';
import { DuplicateEntityError } from '../../common/errors/duplicateentityerror';

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
    public async findByUser(user: User): Promise<UserLogin> {
        if(user == null) {
            throw new NullArgumentError('user');
        }
        else if(isNaN(user.id)){
            throw new ArgumentError('user', 'does not have an id');
        }

        return this.repository.createQueryBuilder('login')
        .leftJoinAndSelect('login.user', 'user')
        .where('login.userId = :id', user)
        .getOne();
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
                    throw new DuplicateEntityError('A login for the user already exists');
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
}