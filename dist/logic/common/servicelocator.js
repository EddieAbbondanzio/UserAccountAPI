"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const duplicateerror_1 = require("../../common/errors/duplicateerror");
const nullargumenterror_1 = require("../../common/errors/nullargumenterror");
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
        if (service == null) {
            throw new nullargumenterror_1.NullArgumentError('service');
        }
        //If the service type already exists, go boom!
        if (this.services.some(s => s.serviceType == service.serviceType)) {
            throw new duplicateerror_1.DuplicateError('A service with type: ' + service.serviceType + ' already exists!');
        }
        this.services.push(service);
    }
    /**
     * Find a specific service.
     * @param type The service type to look for.
     */
    static get(type) {
        if (type == null) {
            throw new nullargumenterror_1.NullArgumentError('type');
        }
        for (let i = 0; i < this.services.length; i++) {
            if (this.services[i].serviceType == type) {
                return this.services[i];
            }
        }
        return null;
    }
    /**
     * Clear out any services that have been registered
     * with the locator.
     */
    static clear() {
        this.services = [];
    }
}
exports.ServiceLocator = ServiceLocator;
//Cheap way of getting a 'static' constructor.
ServiceLocator.services = [];
//# sourceMappingURL=servicelocator.js.map