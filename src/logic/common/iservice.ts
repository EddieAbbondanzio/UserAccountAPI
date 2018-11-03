import { ServiceType } from "./servicetype";
import { Database } from "./database";

/**
 * A business logic layer service.
 */
export interface IService {
    /**
     * The type flag of the service.
     */
    serviceType: ServiceType;
}