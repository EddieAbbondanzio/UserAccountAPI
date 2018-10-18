import { AbstractRepository, EntityRepository, EntityManager, Repository, InsertResult, DeleteResult } from 'typeorm';
import { UserLogin } from "./userlogin";
import { User } from '../user/user';

/**
 * Storage interface for logins of users. Allows for adding a new
 * login of a user, or removing every
 */
@EntityRepository(UserLogin)
export class UserLoginRepository extends AbstractRepository<UserLogin> {
    /**
     * Search for a login for a specific user.
     * @param user The user to look for a login for.
     * @returns The login found (or null).
     */
    public async findByUser(user: User): Promise<UserLogin|undefined> {
        if(user == undefined){
            return undefined;
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
     * @param transactionManager The transaction manager to use when 
     * a database transaction is in progress.
     */
    public async add(userLogin: UserLogin, transactionManager?: EntityManager): Promise<boolean> {
        if(!userLogin){
            return false;
        }

        let loginRepo: Repository<UserLogin> = transactionManager ? transactionManager.getRepository(UserLogin) : this.repository;
        let result: InsertResult = await loginRepo.insert(userLogin);

        return result.raw.affectedRowCount == 1;
    }

    /**
     * Remove an existing login from the database.
     * @param userlogin The userlogin to remove from the database.
     * @param transactionManager The transaction manager to use when 
     * a database transaction is in progress.
     * @returns True if no errors.
     */
    public async delete(userlogin: UserLogin, transactionManager?: EntityManager): Promise<boolean> {
        if(!userlogin){
            return false;
        }

        let loginRepo: Repository<UserLogin> = transactionManager ? transactionManager.getRepository(UserLogin) : this.repository;
        let result: DeleteResult = await loginRepo.delete(userlogin);
        return result.raw.affectedRowCount == 1;
    }

    /**
     * Remove an existing login from the database via it's id.
     * @param id The login id to look for.
     * @param transactionManager The transaction manager to use when a database
     * transaction is in progress.
     * @returns True if no errors.
     */
    public async deleteById(id: number, transactionManager?: EntityManager): Promise<boolean> {
        if(isNaN){
            throw new Error('Invalid id passed.');
        }

        let result: DeleteResult;

        if(transactionManager){
            result = await transactionManager.createQueryBuilder()
            .delete()
            .where('id = :id', {id: id})
            .execute();
        }
        else{
            result = await this.repository.createQueryBuilder()
            .delete()
            .where('id = :id', {id: id})
            .execute();
        }

        return result.raw.affectedRowCount == 1;
    }
}