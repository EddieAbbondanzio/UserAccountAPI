import { IServiceLocator } from "./iservicelocator";

/**
 * Base class for any service that works off the database.
 * A cache of the connection is kept and can be accessed
 * via this.connection.
 */
export abstract class LogicComponent {
    /**
     * The dependency locator.
     */
    protected serviceLocator: IServiceLocator;

    /**
     * Create a new service to the db.
     * @param serviceLocator The service locator.
     */
    constructor(serviceLocator: IServiceLocator){
        this.serviceLocator = serviceLocator;
    }
}