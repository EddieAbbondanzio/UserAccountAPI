"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const datamodule_1 = require("../../../../data/datamodule");
/**
 * Test module for the User Registration data model.
 */
describe('UserRegistration', () => {
    /**
     * Check that assigning the username works.
     */
    test('Constructor parameter username works.', () => {
        let registration = new datamodule_1.UserRegistration('Bert');
        expect(registration.username).toBe('Bert');
    });
    /**
     * Check that assigning the password works.
     */
    test('Constructor parameter password works.', () => {
        let registration = new datamodule_1.UserRegistration('Bert', 'password');
        expect(registration.password).toBe('password');
    });
    /**
     * Check that assigning the name works.
     */
    test('Constructor parameter name works.', () => {
        let registration = new datamodule_1.UserRegistration('Bert', 'password', 'Bert P');
        expect(registration.name).toBe('Bert P');
    });
    /**
     * Check that assigning the email via constructor works.
     */
    test('Constructor parameter email works.', () => {
        let registration = new datamodule_1.UserRegistration('Bert', 'password', 'Bert P', 'Email@domain.com');
        expect(registration.email).toBe('Email@domain.com');
    });
});

//# sourceMappingURL=userregistration.test.js.map
