import { IServiceLocator } from "./iservicelocator";
import { UserService } from "./user/userservice";
import { AuthenticationService } from "./security/authenticationservice";
import { Connection } from "typeorm";

/**
 * Service locator for providing the dependencies
 * that the server relies on. This is dependecy
 * inversion in action.
 */
export class ServiceLocator implements IServiceLocator {
    /**
     * The service for looking up users via their
     * username or password.
     */
    public userService: UserService;

    /**
     * The service for handling credentials and JWTs.
     */
    public authService: AuthenticationService;

    /**
     * Create a new service locator.
     * @param dbConnection The connection to the database.
     */
    constructor(dbConnection: Connection) {
        this.userService = new UserService(dbConnection);
        this.authService = new AuthenticationService(dbConnection);
    }
}