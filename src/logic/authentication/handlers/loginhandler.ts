import { LogicHandler } from "../../common/logichandler";
import { Connection } from "typeorm";
import { IServiceLocator } from "../../common/iservicelocator";
import { User } from "../../../data/user/user";

/**
 * Business logic for the login portion of the
 * authentication component.
 */
export class LoginHandler extends LogicHandler {
    /**
     * Create a new login handler.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator) {
        super(connection, serviceLocator);
    }

    /**
     * Login a user via their credentials.
     * @param username The user's username.
     * @param password The user's password.
     * @returns The user if successful. Otherwise null.
     */
    public async loginUserViaCredentials(username: string, password: string): Promise<User|null> {
        return null;
    }

    /**
     * Login a user using a JWT they have.
     * @param token The JWT from a previous login.
     * @returns The user if successful. Otherwise null.
     */
    public async loginUserViaToken(token: string): Promise<User|null> {
        return null;
    }

    /**
     * Log out a user that is currently logged in.
     * @param username The username to log out.
     * @param loginGuid Their login guid to use.
     * @returns True if logged out.
     */
    public async logoutUser(username: string, loginGuid: string): Promise<boolean> {
        return false;
    }
}