import { IServiceLocator } from "./common/iservicelocator";
import { Connection } from "typeorm";
import { AuthenticationComponent } from "./authentication/authenticationcomponent";
import { UserComponent } from "./user/usercomponent";

/**
 * Handles managing the business logic layer.
 */
export class LogicCoordinator {
    /**
     * The service locator for locating all the 
     * dependencies needed by the logic coordinator.
     */
    public serviceLocator: IServiceLocator;
  
    /**
     * Business logic related to authentication.
     */
    public authenticationComponent: AuthenticationComponent;

    /**
     * Business logic related to users.
     */
    public userComponent: UserComponent;

    /**
     * Create a new logic coordinator for handling the
     * business logic layer.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator) {
        this.serviceLocator = serviceLocator;

        this.authenticationComponent = new AuthenticationComponent(connection, serviceLocator);
        this.userComponent           = new UserComponent(connection, serviceLocator);
    }
}