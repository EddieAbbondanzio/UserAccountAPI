import { IServiceLocator } from "./iservicelocator";

/**
 * Base class for Business logic classes to derive
 * from.
 */
export abstract class LogicHandler {
    /**
     * Handles finding all of the dependecies
     * that may be needed.
     */
    public serviceLocator: IServiceLocator;

    /**
     * Create a new instance of a BLL.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(serviceLocator: IServiceLocator) {
        this.serviceLocator = serviceLocator;
    }
}