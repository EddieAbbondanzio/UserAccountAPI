import { Connection } from "typeorm";
import { TransactionJob } from "./transactionjob";
import { IServiceLocator } from "./iservicelocator";

/**
 * Base class for Business logic classes to derive
 * from.
 */
export abstract class LogicHandler {
    /**
     * The database connection.
     */
    public connection: Connection;
    
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
    constructor(connection: Connection, serviceLocator: IServiceLocator) {
        this.connection = connection;
        this.serviceLocator = serviceLocator;
    }

    /**
     * Execute a database job within a transaction.
     * @param job The job to execute.
     */
    protected async transaction(job: TransactionJob) {
        return await this.connection.transaction(async manager => {
            await job(manager);
        });
    }
}