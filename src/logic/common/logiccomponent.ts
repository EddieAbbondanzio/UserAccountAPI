import { Connection } from "typeorm";
import { TransactionJob } from "./transactionjob";
import { IServiceLocator } from "./iservicelocator";

/**
 * Base class for any service that works off the database.
 * A cache of the connection is kept and can be accessed
 * via this.connection.
 */
export abstract class LogicComponent {
    /**
     * The connection to the database.
     */
    protected connection: Connection;

    /**
     * The dependency locator.
     */
    protected serviceLocator: IServiceLocator;

    /**
     * Create a new service to the db.
     * @param connection The connection to cache.
     * @param serviceLocator The service locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator){
        this.connection = connection;
        this.serviceLocator = serviceLocator;
    }
}