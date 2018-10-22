import { AbstractRepository, EntityRepository, Repository, UpdateResult, EntityManager } from "typeorm";
import { User } from "../../logic/models/user";
import { IUserRepository } from "../../logic/repositories/iuserrepository";
import { UserStats } from "../../logic/models/userstats";

/**
 * Storage interface for Users in the database. Handles loading
 * relationships with other objects such as roles during find operations,
 * and provides the ability to update and remove Users as well.
 */
@EntityRepository(User)
export class UserRepository  extends AbstractRepository<User> implements IUserRepository {
    /**
     * Search for a user via their automatically generated
     * id that is assigned to them after inserting them into
     * the database.
     * @param id The unique numeric id of the desired user.
     * @param includeDeleted If deleted entries should be included
     * in the search as well.
     * @returns The user found. (if any)
     */
    public async findById(id: number, includeDeleted?: boolean):Promise<User> {
        //Why bother searching?
        if(isNaN(id)){
            return null;
        }

        if(includeDeleted){
            return this.repository.createQueryBuilder('user')
            .leftJoinAndSelect('user.stats', 'stats')
            .where('user.id = :id', {id: id})
            .getOne();
        }
        else {
            return this.repository.createQueryBuilder('user')
            .leftJoinAndSelect('user.stats', 'stats')
            .where('user.id = :id', {id: id})
            .andWhere('user.isDeleted = false')
            .getOne();
        }
    }

    /**
     * Search for a user via their unique id. Usernames are unique,
     * and case insensitive to prevent overlap or copy cats.
     * @param username The username of the user to look for.
     * @param includeDeleted If deleted entries should be included
     * in the search as well.
     * @returns The user found. (if any)
     */
    public async findByUsername(username: string, includeDeleted?: boolean):Promise<User> {
        if(username == undefined){
            return undefined;
        }

        if(includeDeleted){
            return this.repository.createQueryBuilder('user')
            .leftJoinAndSelect('user.stats', 'stats')
            .where('user.username = :username', {username: username})
            .getOne();
        }
        else {
            return this.repository.createQueryBuilder('user')
            .leftJoinAndSelect('user.stats', 'stats')
            .where('user.username = :username', {username: username})
            .andWhere('user.isDeleted = false')
            .getOne();
        }
    }

    /**
     * Search for a specific user via their email.
     * @param email The email to look for.
     * @returns User with matching email, or null.
     */
    public async findByEmail(email: string, includeDeleted?: boolean): Promise<User> {
        if(!email){
            return null; 
        }

        if(includeDeleted){
            return this.repository.createQueryBuilder('user')
            .leftJoinAndSelect('user.stats', 'stats')
            .where('user.email = :email', {email: email})
            .getOne();
        }
        else {
            return this.repository.createQueryBuilder('user')
            .leftJoinAndSelect('user.stats', 'stats')
            .where('user.email = :email', {email: email})
            .andWhere('user.isDeleted = false')
            .getOne();
        }
    }

    /**
     * Add a new user to the database. This automatically generates
     * a unique id for them after being inserted.
     * @param user The user to add to the database.
     * @returns True if no error.
     */
    public async add(user: User): Promise<boolean> {
        if(!user){
            return false;
        }

        let userRepo:  Repository<User> = this.repository;
        let statsRepo: Repository<UserStats> = this.getRepositoryFor(UserStats);

        //Deleted users still reserve their username since we 
        //don't want any copy cats.
        let usernameCount: number = await userRepo.createQueryBuilder()
        .select()
        .where('LOWER(username) = LOWER(:username)', user).getCount();

        //Check to ensure the email isn't being used by someone else.
        let emailCount: number = await this.repository.createQueryBuilder()
        .select()
        .where('email = :email', user)
        .andWhere('isDeleted = FALSE')
        .getCount();

        if(usernameCount || emailCount){
            return false;
        }

        //DO NOT use Promise.all()! We need to wait for a
        //user id before we can insert the stats.
        await userRepo.insert(user);
        await statsRepo.insert(user.stats);

        return true;
    }

    /**
     * Update an existing user in the database. This will
     * not allow for changing of usernames or id since these
     * are considered primary keys.
     * @param user The user to update.
     * @returns True if no error.
     */
    public async update(user: User): Promise<boolean> {
        if(!user){
            return false;
        }

        let result: UpdateResult = await this.repository.createQueryBuilder()
        .update(User)
        .set({
            name: user.name, 
            email: user.email,
            isVerified: user.isVerified
        })
        .where('id = :id', {id: user.id})
        .execute();

        return result.raw.affectedRowCount == 1;
    }

    /**
     * Update an existing user's password in the database. This will
     * only update the password hash.
     * @param user The user to update their password.
     * @returns True if no errors occured.
     */
    public async updatePassword(user: User): Promise<boolean> {
        if(!user){
            return false;
        }

        let result: UpdateResult = await this.repository.createQueryBuilder()
        .update(User)
        .set({
            passwordHash: user.passwordHash,
        })
        .where('id = :id', {id: user.id})
        .execute();

        return result.raw.affectedRowCount == 1;
    }

    /**
     * Mark a user as deleted. This will prevent them from being
     * included in any search results when using the find functions.
     * @param user The user to delete.
     * @returns True if no error.
     */
    public async delete(user: User): Promise<boolean> {
        if(user == null){
            return false;
        }

        //We just need to mark the user as deleted
        let result: UpdateResult = await this.repository.createQueryBuilder()
        .update()
        .set({isDeleted: true})
        .where('id = :id', {id: user.id}).execute();

        return result.raw.affectedRowCount == 1;
    }

    /**
     * Checks if a username is free for use.
     * @param username The username to check for availability.
     * @returns True if the username is free
     * for the grabbing.
     */
    public async isUsernameAvailable(username: string):Promise<boolean> {
        if(!username){
            return false;
        }

        //Deleted users still reserve their username
        let foundCount: number = await this.repository.createQueryBuilder()
        .select()
        .where('LOWER(username) = LOWER(:username)', {username: username})
        .getCount();

        return foundCount == 0;
    }

    /**
     * Checks if an email is in use by a user in the database.
     * @param email The email to check.
     * @returns True if the email exists.
     */
    public async isEmailInUse(email: string): Promise<boolean> {
        if(!email){
            return false;
        }

        let foundCount: number = await this.repository.createQueryBuilder()
        .select()
        .where('email = :email', {email: email})
        .andWhere('isDeleted = FALSE')
        .getCount();

        return foundCount == 1;
    }
}