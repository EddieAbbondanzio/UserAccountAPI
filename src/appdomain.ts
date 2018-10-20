import { DataAccessLayer } from "./data/dataaccesslayer";

/**
 * The container of the server. 
 */
export class AppDomain {
    /**
     * The data access layer.
     */
    public static dataAccessLayer: DataAccessLayer;
}