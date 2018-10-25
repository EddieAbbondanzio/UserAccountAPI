import { IUserRepository } from "../../../../logic/repositories/iuserrepository";
import { NullArgumentError } from "../../../../common/errors/nullargumenterror";
import { User } from "../../../../logic/models/user";
import { ArgumentError } from "../../../../common/errors/argumenterror";

/**
 * Stub repository for faking CRUD operations with a 'database'.
 * Only used to test the BLL.
 */
export class StubUserRepository implements IUserRepository {
    /**
     * The users in the repo.
     */
    private users: User[];

    /**
     * Create a new stub repo
     */
    constructor() {
        this.users = [];
    }

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

        for(let i = 0; i < this.users.length; i++){
            if(this.users[i].id == id){
                if(!this.users[i].isDeleted) {
                    return this.users[i];
                }
                else if(this.users[i].isDeleted && includeDeleted){
                    return this.users[i];
                }
            }
        }

        return undefined;
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

        for(let i = 0; i < this.users.length; i++){
            if(this.users[i].username == username){
                if(!this.users[i].isDeleted) {
                    return this.users[i];
                }
                else if(this.users[i].isDeleted && includeDeleted){
                    return this.users[i];
                }
            }
        }

        return undefined;
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

        for(let i = 0; i < this.users.length; i++){
            if(this.users[i].email == email){
                if(!this.users[i].isDeleted) {
                    return this.users[i];
                }
                else if(this.users[i].isDeleted && includeDeleted){
                    return this.users[i];
                }
            }
        }

        return undefined;
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

        this.users.push(user);
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

        let index: number = this.users.findIndex(u => u.id == user.id);

        if(index != -1) {
            this.users[index].name = user.name;
            this.users[index].email = user.email;
            this.users[index].isVerified = user.isVerified;
        }
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

        let index: number = this.users.findIndex(u => u.id == user.id);

        if(index != -1){
            this.users[index].passwordHash = user.passwordHash;
        }
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

        let index: number = this.users.findIndex(u => u.id == user.id);

        if(index != -1){
            this.users.splice(index, 1);
        }
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

        return this.users.find(u => u.username == username) != null;
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

        return this.users.find(u => u.email == email) != null;
    }
}