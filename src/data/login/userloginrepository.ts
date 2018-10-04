import { AbstractRepository, EntityRepository } from 'typeorm';
import { UserLogin } from "./userlogin";
import { User } from '../user/user';
import { StringUtils } from '../../util/stringutils';

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
    public async findByUser(user: User): Promise<UserLogin|null> {
        if(!user){
            return null;
        }

        try {
            return await this.repository.createQueryBuilder('login')
            .leftJoinAndSelect('login.user', 'user')
            .where('login.userId = :id', user)
            .getOne();
        }
        catch(error){
            console.log('Failed to find user login by user: ', error);
            return null;
        }
    }

    /**
     * Add a new user login to the database.
     * @param userLogin The userlogin to add to the database.
     * @returns True if no errors.
     */
    public async add(userLogin: UserLogin): Promise<boolean> {
        if(!userLogin){
            return false;
        }

        try {
            await this.repository.insert(userLogin);
            return true;
        }
        catch(error){
            console.log('Failed to insert user login: ', error);
            return false;
        }
    }

    /**
     * Remove an existing login from the database.
     * @param userlogin The userlogin to remove from the database.
     * @returns True if no errors.
     */
    public async delete(userlogin: UserLogin): Promise<boolean> {
        if(!userlogin){
            return false;
        }

        try {
            await this.repository.delete(userlogin);
            return true;
        }
        catch(error){
            console.log('Failed to delete user login: ', error);
            return false;
        }
    }
}