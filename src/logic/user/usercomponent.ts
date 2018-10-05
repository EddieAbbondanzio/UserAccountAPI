import { LogicComponent } from "../common/logiccomponent";
import { Connection } from "typeorm";
import { IServiceLocator } from "../common/iservicelocator";
import { UserHandler } from "./handlers/userhandler";
import { RecoveryHandler } from "./handlers/recoveryhandler";

/**
 * Business logic for anything related to users.
 */
export class UserComponent extends LogicComponent {
    /**
     * Handles managing users.
     */
    public userHandler: UserHandler;

    /**
     * Handles recovering lost user accounts.
     */
    public recoveryHandler: RecoveryHandler;

    /**
     * Create a new user component.
     * @param connection The database connection.
     * @param serviceLocator The service locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator){
        super(connection, serviceLocator);

        this.userHandler     = new UserHandler(connection, serviceLocator);
        this.recoveryHandler = new RecoveryHandler(connection, serviceLocator);
    }

}