import { IVerificationTokenRepository } from "../../../../logic/repositories/iverificationtokenrepository";
import { VerificationToken } from "../../../../logic/models/verificationtoken";
import { User } from "../../../../logic/models/user";
import { NullArgumentError } from "../../../../common/errors/nullargumenterror";
import { ArgumentError } from "../../../../common/errors/argumenterror";
import { DuplicateEntityError } from "../../../../common/errors/duplicateentityerror";

/**
 * Stub repository for faking CRUD operations with a 'database'.
 * Only used to test the BLL.
 */
export class StubVerificationTokenRepository implements IVerificationTokenRepository {
    /**
     * The tokens in the repo.
     */
    private verificationTokens: VerificationToken[];

    /**
     * Create a new stub repo.
     */
    constructor(){
        this.verificationTokens = [];
    }

    /**
     * Searches for a user's validation token.
     * @param user The user to look for a validation token for.
     * @returns The token found (or null).
     */
    public async findByUser(user: User): Promise<VerificationToken> {
        if(user == null){
            throw new NullArgumentError('user');
        }
        else if(isNaN(user.id)){
            throw new ArgumentError('user', 'does not have an id');
        }

        return this.verificationTokens.find(t => t.user == user);
    }

    /**
     * Add a new validation token to the database.
     * @param verificationToken The token to add to the database.
     */
    public async add(verificationToken: VerificationToken): Promise<void> {
        if(verificationToken == null) {
            throw new NullArgumentError('verificationToken');
        }

        if(this.verificationTokens.find(t => t.user == verificationToken.user)){
            throw new DuplicateEntityError('A reset token for the user already exists');
        }
    }

    /**
     * Delete an existing validation token from the database.
     * @param validationtoken The validation token to delete.
     */
    public async delete(verificationToken: VerificationToken): Promise<void> {
        if(verificationToken == null) {
            throw new NullArgumentError('verificationToken');
        }

        let index: number = this.verificationTokens.findIndex(t => t.user == verificationToken.user);

        if(index != -1){
            this.verificationTokens.splice(index, 1);
        }
    }
}