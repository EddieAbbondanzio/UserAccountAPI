"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The service resolver. Allows for register services,
 * and finding them later on.
 */
class ServiceLocator {
    /**
     * Register a new service with the locator.
     * @param service The service to register.
     */
    static register(service) {
        //If the service type already exists, go boom!
        if (this.services.some(s => s.serviceType == service.serviceType)) {
            throw new Error('A service with type: ' + service.serviceType + ' already exists!');
        }
        this.services.push(service);
    }
    /**
     * Find a specific service.
     * @param type The service type to look for.
     */
    static get(type) {
        for (let i = 0; i < this.services.length; i++) {
            if (this.services[i].serviceType == type) {
                return this.services[i];
            }
        }
        return null;
    }
}
exports.ServiceLocator = ServiceLocator;
//Cheap way of getting a 'static' constructor.
ServiceLocator.services = [];
//# sourceMappingURL=servicelocator.js.map