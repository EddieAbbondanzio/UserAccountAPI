import { AbstractRepository, EntityRepository, EntityManager, Repository, InsertResult, DeleteResult } from 'typeorm';
import { User } from '../../logic/models/user';
import { UserLogin } from '../../logic/models/userlogin';
import { IUserLoginRepository } from '../../logic/repositories/iuserloginrepository';

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
            throw new Error('No user passed in.');
        }

        return this.repository.createQueryBuilder('login')
        .leftJoinAndSelect('login.user', 'user')
        .where('login.userId = :id', user)
        .getOne();
    }

    /**
     * Add a new user login to the database.
     * @param userLogin The userlogin to add to the database.
     * @returns True if no errors.
     */
    public async add(userLogin: UserLogin): Promise<boolean> {
        if(userLogin == null) {
            throw new Error('No userLogin passed in.');
        }

        let result: InsertResult = await this.repository.insert(userLogin);
        return result.raw.affectedRowCount == 1;
    }

    /**
     * Remove an existing login from the database.
     * @param userlogin The userlogin to remove from the database.
     * @returns True if no errors.
     */
    public async delete(userlogin: UserLogin): Promise<boolean> {
        if(userlogin == null) {
            throw new Error('No userLogin passed in.');
        }

        let result: DeleteResult = await this.repository.delete(userlogin);
        return result.raw.affectedRowCount == 1;
    }

    /**
     * Remove an existing login from the database via it's id.
     * @param id The login id to look for.
     * @returns True if no errors.
     */
    public async deleteById(id: number): Promise<boolean> {
        if(isNaN){
            throw new Error('Invalid id passed.');
        }

        let result: DeleteResult = await this.repository.createQueryBuilder()
            .delete()
            .where('id = :id', {id: id})
            .execute();

        return result.raw.affectedRowCount == 1;
    }
}