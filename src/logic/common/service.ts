import { Connection } from "typeorm";

/**
 * Base class for any service that works off the database.
 * A cache of the connection is kept and can be accessed
 * via this.connection.
 */
export abstract class Service {
    /**
     * The connection to the database.
     */
    public connection: Connection;

    /**
     * Create a new service to the db.
     * @param connection The connection to cache.
     */
    public constructor(connection: Connection){
        this.connection = connection;
    }
}