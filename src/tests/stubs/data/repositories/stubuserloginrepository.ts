import { IUserLoginRepository } from "../../../../logic/repositories/iuserloginrepository";
import { UserLogin } from "../../../../logic/models/userlogin";
import { User } from "../../../../logic/models/user";
import { NullArgumentError } from "../../../../common/errors/nullargumenterror";
import { ArgumentError } from "../../../../common/errors/argumenterror";
import { DuplicateEntityError } from "../../../../common/errors/duplicateentityerror";

/**
 * Stub repository for faking CRUD operations with a 'database'.
 * Only used to test the BLL.
 */
export class StubUserLoginRepository implements IUserLoginRepository {
    /**
     * The user logins stored in the repo.
     */
    private logins: UserLogin[];

    /**
     * Create a new stub repo.
     */
    constructor() {
        this.logins = [];
    }

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

        return this.logins.find(l => l.user == user);
    }

    /**
     * Add a new user login to the database.
     * @param userLogin The userlogin to add to the database.
     */
    public async add(userLogin: UserLogin): Promise<void> {
        if(userLogin == null) {
            throw new NullArgumentError('userLogin');
        }

        if(this.logins.find(l => l.user == userLogin.user)){
            throw new DuplicateEntityError('A login for the user already exists');
        }

        this.logins.push(userLogin);
    }

    /**
     * Remove an existing login from the database.
     * @param userlogin The userlogin to remove from the database.
     */
    public async delete(userlogin: UserLogin): Promise<void> {
        if(userlogin == null) {
            throw new NullArgumentError('userLogin');
        }

        let index: number = this.logins.findIndex(l => l.user == userlogin.user);

        if(index != -1){
            this.logins.splice(index, 1);
        }
    }
}