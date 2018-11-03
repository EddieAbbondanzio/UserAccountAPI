import { Database } from "./database";
import { IService } from "./iservice";
import { ServiceType } from "./servicetype";

/**
 * A database service is one that interacts directly with
 * the database through the use of repositories.
 */
export abstract class DatabaseService implements IService {
    /**
     * The type of service.
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