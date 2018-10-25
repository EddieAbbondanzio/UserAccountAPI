import { ConnectionOptions, ConnectionOptionsReader } from "typeorm";

/**
 * All of the various database configuration settings.
 */
export class DatabaseConfig {
    /**
     * The IP address of the database server.
     */
    host: string;

    /**
     * The port number to connect to.
     */
    port: number;

    /**
     * The database account username.
     */
    public username: string;

    /**
     * The database account password.
     */
    public password: string;

    /**
     * The name of the database to connect to.
     */
    public database: string;

    /**
     * If the database schema should automatically
     * be updated.
     */
    public autoSchemaSync: boolean;

    /**
     * The directory where all of the entities are
     * stored.
     */
    public entities: string;

    /**
     * The directory where all of the subscribers
     * are stored.
     */
    public subscribers: string;

    /**
     * The directory where all of the migrations
     * are stored.
     */
    public migrations: string;
}