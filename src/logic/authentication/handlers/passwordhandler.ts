import { LogicHandler } from "../../common/logichandler";
import { Connection, EntityManager } from "typeorm";
import { IServiceLocator } from "../../common/iservicelocator";
import { User } from "../../../data/user/user";
import { AuthenticationError } from "../common/authenticationerror";
import { UserRepository, ResetToken, ResetTokenRespository } from "../../../data/datamodule";

/**
 * Business logic for resetting or updating user passwords.
 */
export class PasswordHandler extends LogicHandler {
    /**
     * The user repository for CRUD operations with
     * the database.
     */
    private userRepo: UserRepository;

    /**
     * The reset token repository for CRUD
     * operations with the database.
     */
    private resetTokenRepo: ResetTokenRespository;

    /**
     * Create a new password handler.
     * @param connection The database connection.
     * @param serviceLocator The depedency locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator) {
        super(connection, serviceLocator);
        this.userRepo       = connection.getCustomRepository(UserRepository);
        this.resetTokenRepo = connection.getCustomRepository(ResetTokenRespository);
    }

    /**
     * Reset a user's password after verifying their token is valid.
     * @param user The user.
     * @param resetCode Their temporary access password.
     * @param newPassword Their new desired password.
     * @returns True if the token was valid.
     */
    public async resetPassword(user: User, resetCode: string, newPassword: string): Promise<boolean> {
        if(!user){
            throw new Error('No user passed in');
        }

        //Need to pull in the reset token for them.
        let resetToken: ResetToken = await this.resetTokenRepo.findByUser(user);

        if(resetToken && resetToken.code == resetCode){
            await user.setPassword(newPassword);

            //Don't want to fail to update the user but revoke their reset token.
            return await this.transaction(async (manager: EntityManager): Promise<boolean> => {
                let rTokenRepo: ResetTokenRespository = manager.getCustomRepository(ResetTokenRespository);
                let userRepo: UserRepository          = manager.getCustomRepository(UserRepository);

                await Promise.all([rTokenRepo.delete(resetToken, manager), userRepo.updatePassword(user, manager)]);
                return true;
            });
        }

        return false;
    }

    /**
     * Update a user's password. This only proceeds if their current
     * password passed in is valid.
     * @param user The user to update.
     * @param currPassword Their current password.
     * @param newPassword Their new desired password.
     * @returns True if successful.
     */
    public async updatePassword(user: User, currPassword: string, newPassword: string): Promise<boolean> {
        if(!user){
            throw new Error('No user passed in.');
        }

        if(!(await user.validatePassword(currPassword))){
            throw new AuthenticationError('Invalid password.');
        }

        //Gotta update the password before we can update the user in the db.
        await user.setPassword(newPassword);
        await this.userRepo.updatePassword(user);

        return false;
    }
}