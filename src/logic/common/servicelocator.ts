import { Service } from "./service";
import { ServiceType } from "./servicetype";

/**
 * The service resolver. Allows for register services,
 * and finding them later on.
 */
export class ServiceLocator {
    /**
     * The list of services available.
     */
    public static services: Service[];

    /**
     * Register a new service with the locator.
     * @param service The service to register.
     */
    public static register<T extends Service>(service: T)  {
        //If the service type already exists, go boom!
        if(this.services.some(s => s.serviceType == service.serviceType)) {
            throw new Error('A service with type: ' + service.serviceType + ' already exists!');
        }

        this.services.push(service);
    }

    /**
     * Find a specific service.
     * @param type The service type to look for.
     */
    public static get<T extends Service>(type: ServiceType) {
        for(let i = 0; i < this.services.length; i++){
            if(this.services[i].serviceType == type){
                return this.services[i];
            }
        }

        return null;
    }
}

//Cheap way of getting a 'static' constructor.
ServiceLocator.services = [];