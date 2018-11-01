import { expect } from 'chai';
import 'mocha';
import { ServiceLocator } from "../../../../logic/common/servicelocator";
import { Service } from "../../../../logic/common/service";
import { ServiceType } from "../../../../logic/common/servicetype";
import { NullArgumentError } from "../../../../common/error/types/nullargumenterror";
import { DuplicateError } from "../../../../common/error/types/duplicateerror";

/**
 * Mock class to test with.
 */
class MockUserService extends Service {
    public serviceType: ServiceType = ServiceType.User;
}

/**
 * Test module for the service locator.
 */
describe('ServiceLocator', () => {
    afterEach(() => {
        ServiceLocator.clear();
    });

    /**
     * Test module for the clear() method.
     */
    describe('clear()', () => {
        it('clears out any existing services with the locator', () => {
            ServiceLocator.services.push(new MockUserService(null));
            ServiceLocator.clear();

            expect(ServiceLocator.services).to.have.lengthOf(0);
        });
    });

    /**
     * Tests for the register() method.
     */
    describe('register()', () => {
        it('throws an error if null is passed', () => {
            expect(() => { ServiceLocator.register(null); }).to.throw(NullArgumentError);
        });

        it('registers a service with the locator', () => {
            let mockService: MockUserService = new MockUserService(null);
            ServiceLocator.register(mockService);
            expect(ServiceLocator.services).to.have.members([mockService]);
        });

        it('throws an error if a duplicate exists', () => {
            let mockService: MockUserService = new MockUserService(null);

            ServiceLocator.register(mockService);
            expect(() => { ServiceLocator.register(mockService); }).to.throw(DuplicateError);
        });
    });

    /**
     * Tests for the get() method.
     */
    describe('get()', () => {
        it('throws an error if no type passed', () => {
            expect(() => { ServiceLocator.get(null); }).to.throw(NullArgumentError);
        });

        it('returns null if no matching service type found.', () => {
            expect(ServiceLocator.get(ServiceType.Auth)).to.be.null;
        });

        it('returns a service if the type matches', () => {
            let mockService: MockUserService = new MockUserService(null);
            ServiceLocator.register(mockService);

            expect(ServiceLocator.get<MockUserService>(ServiceType.User)).to.be.instanceof(MockUserService);
        });
    });
});