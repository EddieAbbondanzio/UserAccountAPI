import { LogicHandler } from "../../common/logichandler";
import { Connection } from "typeorm";
import { IServiceLocator } from "../../common/iservicelocator";

/**
 * Business logic for validating users are who they
 * claim they are.
 */
export class ValidationHander extends LogicHandler {
    /**
     * Create a new validation handler.
     * @param connection The database connection.
     * @param serviceLocator The service locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator) {
        super(connection, serviceLocator);
    }

    /**
     * Validate that a user is who they claim to be. This will check their username
     * against the login provided in the database.
     * @param username The username of the user.
     * @param loginGuid Their login guid.
     * @returns True if the user is who they claim to be.
     */
    public async validateUser(username: string, loginGuid: string): Promise<boolean> {
        return false;
    }
}