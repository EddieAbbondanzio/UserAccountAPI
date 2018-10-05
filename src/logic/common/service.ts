import { Connection } from "typeorm";
import { TransactionJob } from "./transactionjob";

/**
 * Base class for any service that works off the database.
 * A cache of the connection is kept and can be accessed
 * via this.connection.
 */
export abstract class Service {
    /**
     * The connection to the database.
     */
    protected connection: Connection;

    /**
     * Create a new service to the db.
     * @param connection The connection to cache.
     */
    constructor(connection: Connection){
        this.connection = connection;
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