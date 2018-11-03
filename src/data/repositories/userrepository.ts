import { AbstractRepository, EntityRepository, Repository, UpdateResult, EntityManager } from "typeorm";
import { User } from "../../logic/models/user";
import { UserStats } from "../../logic/models/userstats";
import { ArgumentError } from "../../common/error/types/argumenterror";
import { NullArgumentError } from "../../common/error/types/nullargumenterror";
import { IUserRepository } from "../../logic/contract/repositories/iuserrepository";

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
        if(isNaN(id)){
            throw new ArgumentError('id');
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
        if(username == null){
            throw new NullArgumentError('username');
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
        if(email == null){
            throw new NullArgumentError('email');
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
     */
    public async add(user: User): Promise<void> {
        if(user == null){
            throw new NullArgumentError('user');
        }

        let userRepo:  Repository<User> = this.repository;
        let statsRepo: Repository<UserStats> = this.getRepositoryFor(UserStats);
   
        try {
            //DO NOT use Promise.all()! We need to wait for a
            //user id before we can insert the stats.
            await userRepo.insert(user);
            await statsRepo.insert(user.stats);
        }
        catch(error) {
            //TODO: REVISE THIS
            //Pass it higher up, no clue what it is.
            throw error;
        }
    }

    /**
     * Update an existing user in the database. This will
     * not allow for changing of usernames or id since these
     * are considered primary keys.
     * @param user The user to update.
     */
    public async update(user: User): Promise<void> {
        if(user == null){
            throw new NullArgumentError('user');
        }

        await this.repository.createQueryBuilder()
        .update(User)
        .set({
            name: user.name, 
            email: user.email,
            isVerified: user.isVerified
        })
        .where('id = :id', user)
        .execute();
    }

    /**
     * Update an existing user's password in the database. This will
     * only update the password hash.
     * @param user The user to update their password.
     */
    public async updatePassword(user: User): Promise<void> {
        if(user == null){
            throw new NullArgumentError('user');
        }

        await this.repository.createQueryBuilder()
        .update(User)
        .set({
            passwordHash: user.passwordHash,
        })
        .where('id = :id', user)
        .execute();
    }

    /**
     * Mark a user as deleted. This will prevent them from being
     * included in any search results when using the find functions.
     * @param user The user to delete.
     */
    public async delete(user: User): Promise<void> {
        if(user == null){
            throw new NullArgumentError('user');
        }

        //We just need to mark the user as deleted
        await this.repository.createQueryBuilder()
        .update()
        .set({isDeleted: true})
        .where('id = :id', user).execute();
    }

    /**
     * Checks if a username is free for use.
     * @param username The username to check for availability.
     * @returns True if the username is free
     * for the grabbing.
     */
    public async isUsernameAvailable(username: string):Promise<boolean> {
        if(username == null){
            throw new NullArgumentError('username');
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
        if(email == null){
            throw new NullArgumentError('email');
        }

        let foundCount: number = await this.repository.createQueryBuilder()
        .select()
        .where('email = :email', {email: email})
        .andWhere('isDeleted = FALSE')
        .getCount();

        return foundCount == 1;
    }
}