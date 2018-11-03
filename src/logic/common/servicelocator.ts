import { ServiceType } from "./servicetype";
import { DuplicateError } from "../../common/error/types/duplicateerror";
import { NullArgumentError } from "../../common/error/types/nullargumenterror";
import { IService } from "./iservice";

/**
 * The service resolver. Allows for register services,
 * and finding them later on.
 */
export class ServiceLocator {
    /**
     * The list of services available.
     */
    public static services: IService[];

    /**
     * Register a new service with the locator.
     * @param service The service to register.
     */
    public static register<T extends IService>(service: T)  {
        if(service == null){
            throw new NullArgumentError('service');
        }

        //If the service type already exists, go boom!
        if(this.services.some(s => s.serviceType == service.serviceType)) {
            throw new DuplicateError('A service with type: ' + service.serviceType + ' already exists!');
        }

        this.services.push(service);
    }

    /**
     * Find a specific service.
     * @param type The service type to look for.
     */
    public static get<T extends IService>(type: ServiceType) {
        if(type == null){
            throw new NullArgumentError('type');
        }

        for(let i = 0; i < this.services.length; i++){
            if(this.services[i].serviceType == type){
                return this.services[i] as T;
            }
        }

        return null;
    }

    /**
     * Clear out any services that have been registered
     * with the locator.
     */
    public static clear() {
        this.services = [];
    }
}

//Cheap way of getting a 'static' constructor.
ServiceLocator.services = [];