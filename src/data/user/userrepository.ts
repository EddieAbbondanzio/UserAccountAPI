import { AbstractRepository, EntityRepository, Repository } from "typeorm";
import { User } from "./user";
import { UserStats } from "./userstats";
import { UserLoginRepository } from "../login/userloginrepository";

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
     * @returns {Promise<User>} The user found. (if any)
     */
    public async findById(id: number, includeDeleted: boolean = false):Promise<User|null> {
        //Why bother searching?
        if(id == null){
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
     * @returns {Promise<User>} The user found. (if any)
     */
    public async findByUsername(username: string, includeDeleted: boolean = false):Promise<User|null> {
        if(!username){
            return null;
        }

        try {
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
        catch(error){
            console.log('Failed to find by username: ', username);
            return null;
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

        try {
            let userRepo = this.repository;
            let statsRepo = this.manager.getRepository(UserStats);

            //Deleted users still reserve their username since we 
            //don't want any copy cats.
            let foundCount: number = await userRepo.createQueryBuilder()
            .select()
            .where('LOWER(username) = LOWER(:username)', user).getCount();

            if(foundCount > 0){
                return false;
            }

            //We have to await the user repo insert since
            //we need a user id for the stat insert.
            await userRepo.insert(user);
            await statsRepo.insert(user.stats);

            return true;
        }
        catch(error){
            console.log('Failed to add new user: ', error);
            return false;
        }
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

        try {
            //We don't allow everything to be changed since username should NEVER change.
            await this.repository.createQueryBuilder()
            .update(User)
            .set({
                passwordHash: user.passwordHash, 
                name: user.name, 
                email: user.email
            })
            .where('id = :id', {id: user.id})
            .execute();

            return true;
        }
        catch(error){
            console.log('Failed to update user: ', error);
            return false;
        }
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

        try {
            await this.manager.connection.transaction(async manager => {
                let userRepo = manager.getRepository(User);

                //We just need to mark the user as deleted
                await userRepo.createQueryBuilder()
                .update()
                .set({isDeleted: true})
                .where('id = :id', {id: user.id}).execute();
            });

            return true;
        }
        catch(error){
            console.log('Failed to delete user: ', error);
            return false;
        }
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

        try {
            //Deleted users still reserve their username
            let foundCount = await this.repository.createQueryBuilder()
            .select()
            .where('LOWER(username) = LOWER(:username)', {username: username})
            .getCount();

            return foundCount == 0;
        }
        catch(error){
            console.log('Failed to check for username availability: ', error);
            return false;
        }
    }
}