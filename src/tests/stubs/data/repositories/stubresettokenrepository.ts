import { IResetTokenRepository } from "../../../../logic/repositories/iresettokenrepository";
import { ResetToken } from "../../../../logic/models/resettoken";
import { User } from "../../../../logic/models/user";
import { NullArgumentError } from "../../../../common/errors/nullargumenterror";
import { ArgumentError } from "../../../../common/errors/argumenterror";
import { DuplicateEntityError } from "../../../../common/errors/duplicateentityerror";

/**
 * Stub repository for faking CRUD operations with a 'database'.
 * Only used for unit testing the BLL.
 */
export class StubResetTokenRepository implements IResetTokenRepository {
    /**
     * The reset tokens being stored in the repo.
     */
    private resetTokens: ResetToken[];

    /**
     * Create a new stub repo.
     */
    constructor() {
        this.resetTokens = [];
    }

    /**
     * Search for a token via their user.
     * @param user The user to look for a reset token for.
     * @returns The token of the user.
     */
    public async findByUser(user: User): Promise<ResetToken> {
        if(user == null){
            throw new NullArgumentError('user');
        }
        else if(isNaN(user.id)){
            throw new ArgumentError('user', 'does not have an id');
        }

        return this.resetTokens.find(t => t.user == user);
    }

    
    /**
     * Add a new reset token to the database.
     * @param resetToken The token to add to the database.
     * @returns True if no errors.
     */
    public async add(resetToken: ResetToken): Promise<void> {
        if(resetToken == null) {
            throw new NullArgumentError('resetToken');
        }

        if(this.resetTokens.find(t => t.user == resetToken.user) != null){
            throw new DuplicateEntityError('A reset token for the user already exists');
        }
        
        this.resetTokens.push(resetToken);
    }

    
    /**
     * Delete an existing reset token from the database.
     * @param resetToken The reset token to delete.
     * @returns True if no errors.
     */
    public async delete(resetToken: ResetToken): Promise<void> {
        if(resetToken == null) {
            throw new NullArgumentError('resetToken');
        }

        let index: number = this.resetTokens.findIndex(t => t.user == resetToken.user);

        if(index != -1){
            this.resetTokens.splice(index, 1);
        }
    }
}