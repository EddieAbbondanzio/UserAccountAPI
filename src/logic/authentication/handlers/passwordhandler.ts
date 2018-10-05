import { LogicHandler } from "../../common/logichandler";
import { Connection } from "typeorm";
import { IServiceLocator } from "../../common/iservicelocator";

/**
 * Business logic for resetting or updating user passwords.
 */
export class PasswordHandler extends LogicHandler {
    /**
     * Create a new password handler.
     * @param connection The database connection.
     * @param serviceLocator The depedency locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator) {
        super(connection, serviceLocator);
    }

    /**
     * Reset a user's password after verifying their token is valid.
     * @param username The username of the user.
     * @param passwordToken Their temporary access password.
     * @param newPassword Their new desired password.
     * @returns True if the token was valid.
     */
    public async resetPassword(username: string, passwordToken: string, newPassword: string): Promise<boolean> {
        return false;
    }

    /**
     * Update a user's password. This only proceeds if their current
     * password passed in is valid.
     * @param username The username of the user.
     * @param currPassword Their current password.
     * @param newPassword Their new desired password.
     * @returns True if successful.
     */
    public async updatePassword(username: string, currPassword: string, newPassword: string): Promise<boolean> {
        return false;
    }
}