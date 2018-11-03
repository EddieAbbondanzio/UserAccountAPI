"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const servicelocator_1 = require("../../../../logic/common/servicelocator");
const servicetype_1 = require("../../../../logic/common/servicetype");
const nullargumenterror_1 = require("../../../../common/error/types/nullargumenterror");
const duplicateerror_1 = require("../../../../common/error/types/duplicateerror");
/**
 * Mock class to test with.
 */
class MockUserService {
    constructor() {
        this.serviceType = servicetype_1.ServiceType.User;
    }
}
/**
 * Test module for the service locator.
 */
describe('ServiceLocator', () => {
    afterEach(() => {
        servicelocator_1.ServiceLocator.clear();
    });
    /**
     * Test module for the clear() method.
     */
    describe('clear()', () => {
        it('clears out any existing services with the locator', () => {
            servicelocator_1.ServiceLocator.services.push(new MockUserService());
            servicelocator_1.ServiceLocator.clear();
            chai_1.expect(servicelocator_1.ServiceLocator.services).to.have.lengthOf(0);
        });
    });
    /**
     * Tests for the register() method.
     */
    describe('register()', () => {
        it('throws an error if null is passed', () => {
            chai_1.expect(() => { servicelocator_1.ServiceLocator.register(null); }).to.throw(nullargumenterror_1.NullArgumentError);
        });
        it('registers a service with the locator', () => {
            let mockService = new MockUserService();
            servicelocator_1.ServiceLocator.register(mockService);
            chai_1.expect(servicelocator_1.ServiceLocator.services).to.have.members([mockService]);
        });
        it('throws an error if a duplicate exists', () => {
            let mockService = new MockUserService();
            servicelocator_1.ServiceLocator.register(mockService);
            chai_1.expect(() => { servicelocator_1.ServiceLocator.register(mockService); }).to.throw(duplicateerror_1.DuplicateError);
        });
    });
    /**
     * Tests for the get() method.
     */
    describe('get()', () => {
        it('throws an error if no type passed', () => {
            chai_1.expect(() => { servicelocator_1.ServiceLocator.get(null); }).to.throw(nullargumenterror_1.NullArgumentError);
        });
        it('returns null if no matching service type found.', () => {
            chai_1.expect(servicelocator_1.ServiceLocator.get(servicetype_1.ServiceType.Auth)).to.be.null;
        });
        it('returns a service if the type matches', () => {
            let mockService = new MockUserService();
            servicelocator_1.ServiceLocator.register(mockService);
            chai_1.expect(servicelocator_1.ServiceLocator.get(servicetype_1.ServiceType.User)).to.be.instanceof(MockUserService);
        });
    });
});
//# sourceMappingURL=servicelocator.test.js.map