import { AbstractRepository, EntityRepository, Repository, UpdateResult, EntityManager } from "typeorm";
import { User } from "./user";
import { UserStats } from "./userstats";

/**
 * Storage interface for Users in the database. Handles loading
 * relationships with other objects such as roles during find operations,
 * and provides the ability to update and remove Users as well.
 */
@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
    /**
     * Search for a user via their automatically generated
     * id that is assigned to them after inserting them into
     * the database.
     * @param id The unique numeric id of the desired user.
     * @param includeDeleted If deleted entries should be included
     * in the search as well.
     * @returns The user found. (if any)
     */
    public async findById(id: number, includeDeleted: boolean = false):Promise<User> {
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
        if(!username){
            return null;
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
     * @param transactionManager The transaction manager to use when 
     * a database transaction is in progress.
     * @returns True if no error.
     */
    public async add(user: User, transactionManager?: EntityManager): Promise<boolean> {
        if(!user){
            return false;
        }

        let userRepo:  Repository<User>;
        let statsRepo: Repository<UserStats>;

        //Are we running in a transaction?
        if(transactionManager){
            userRepo  = transactionManager.getRepository(User);
            statsRepo = transactionManager.getRepository(UserStats);
        }
        else {
            userRepo  = this.repository;
            statsRepo = this.getRepositoryFor(UserStats);
        }

        //Deleted users still reserve their username since we 
        //don't want any copy cats.
        let foundCount: number = await userRepo.createQueryBuilder()
        .select()
        .where('LOWER(username) = LOWER(:username)', user).getCount();

        if(foundCount > 0){
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
     * @param transactionManager The transaction manager to use
     * when a database transaction is in progress.
     * @returns True if no error.
     */
    public async update(user: User, transactionManager?: EntityManager): Promise<boolean> {
        if(!user){
            return false;
        }

        let userRepo: Repository<User> = transactionManager ? transactionManager.getRepository(User) : this.repository;

        let result: UpdateResult = await userRepo.createQueryBuilder()
        .update(User)
        .set({
            name: user.name, 
            email: user.email,
        })
        .where('id = :id', {id: user.id})
        .execute();

        return result.raw.affectedRowCount == 1;
    }

    /**
     * Update an existing user's password in the database. This will
     * only update the password hash.
     * @param user The user to update their password.
     * @param transactionManager The transaction manager to use
     * when a database transaction is in progress.
     * @returns True if no errors occured.
     */
    public async updatePassword(user: User, transactionManager?: EntityManager): Promise<boolean>{
        if(!user){
            return false;
        }

        let userRepo: Repository<User> = transactionManager ? transactionManager.getRepository(User) : this.repository;

        let result: UpdateResult = await userRepo.createQueryBuilder()
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
     * @param transactionManager The transaction manager to use
     * when a database transaction is in progress.
     * @returns True if no error.
     */
    public async delete(user: User, transactionManager?: EntityManager): Promise<boolean> {
        if(user == null){
            return false;
        }

        let userRepo: Repository<User> = transactionManager ? transactionManager.getRepository(User) : this.repository;

        //We just need to mark the user as deleted
        let result: UpdateResult = await userRepo.createQueryBuilder()
        .update()
        .set({isDeleted: true})
        .where('id = :id', {id: user.id}).execute();

        return result.raw.affectedRowCount == 1;
    }

    /**
     * Checks if a username is free for use.
     * @param username The username to check for availability.
     * @returns {Promise<boolean>} True if the username is free
     * for the grabbing.
     */
    public async isUsernameAvailable(username: string):Promise<boolean> {
        if(!username){
            return false;
        }

        //Deleted users still reserve their username
        let foundCount = await this.repository.createQueryBuilder()
        .select()
        .where('LOWER(username) = LOWER(:username)', {username: username})
        .getCount();

        return foundCount == 0;
    }
}