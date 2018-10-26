import { ServiceType } from "./servicetype";
import { Database } from "./database";

/**
 * A business logic layer service.
 */
export abstract class Service {
    /**
     * The type flag of the service.
     */
    readonly abstract serviceType: ServiceType;

    /**
     * The current database being used.
     */
    protected database: Database;

    /**
     * Create a new BLL service.
     * @param database The current database.
     */
    constructor(database: Database){
        this.database = database;
    }
}