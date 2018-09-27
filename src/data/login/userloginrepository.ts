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
     * Search for a userlogin via it's unique id.
     * @param id The id of the login to search for.
     * @returns{Promise<UserLogin} The userlogin (if found).
     */
    public async findByGuid(guid: string):Promise<UserLogin> {
        if(StringUtils.isBlank(guid)){
            throw new Error("No guid passed in");
        }
        else {
            return await this.repository.createQueryBuilder('login')
            .leftJoinAndSelect('login.user', 'user')
            .where('login.guid = :guid', {guid: guid})
            .andWhere('user.isDeleted = false')
            .getOne();
        }
    }

    /**
     * Add a new login for a user to the database. Also prunes
     * old data by removing unused logins.
     * @param userlogin The login to add to the database.
     */
    public async add(userlogin: UserLogin):Promise<UserLogin> {
        if(userlogin == null){
            return null;
        }

        //Delete old logins for user
        await this.repository.createQueryBuilder()
        .delete()
        .from(UserLogin)
        .where('userId = :id', {id: userlogin.user.id})
        .execute();

        //Save the new one and return it back.
        return this.repository.save(userlogin);
    }

    /**
     * Remove a userlogin from the database.
     * @param userlogin The login to delete.
     */
    public async delete(userlogin: UserLogin) {
        if(userlogin == null){
            return;
        }

        await this.repository.createQueryBuilder()
        .delete()
        .from(UserLogin)
        .where('id = :id', userlogin)
        .execute();
    }

    /**
     * Remove an existing login from the database.
     * @param loginId The login id of the login
     * to remove from the database.
     */
    public async deleteByGuid(guid: string) {
        await this.repository.createQueryBuilder()
        .delete()
        .from(UserLogin)
        .where('guid = :guid', {guid: guid})
        .execute();
    }
}