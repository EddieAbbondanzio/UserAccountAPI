import { IDatabase } from "./idatabase";
import { ServiceType } from "./servicetype";

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
    protected database: IDatabase;

    /**
     * Create a new BLL service.
     * @param database The current database.
     */
    constructor(database: IDatabase){
        this.database = database;
    }
}