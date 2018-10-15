"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const user_1 = require("../../data/user/user");
/**
 * Test module for the user data model.
 */
describe('Users', () => {
    /**
     * The user test object to work with.
     */
    let user;
    /**
     * Reset the user before each test.
     */
    beforeEach(() => {
        user = new user_1.User();
    });
    /**
     * Check that the isVerified is always false when creating
     * a new user.
     */
    test('Initialized with an isVerified of false.', () => {
        expect(user.isVerified).toBeFalsy();
    });
    /**
     * Verify that the isDeleted status is always false
     * when creating a new user.
     */
    test('Initialized with an isDeleted of false.', () => {
        expect(user.isDeleted).toBeFalsy();
    });
    /**
     * Ensure a password is properly set on the suer.
     */
    test('Can set a password.', () => __awaiter(this, void 0, void 0, function* () {
        jest.setTimeout(7500);
        yield user.setPassword('testpass');
        expect(user.passwordHash).toBeDefined();
    }));
    /**
     * Ensure that a password is matched up after
     * hashing.
     */
    test('Can verify matching password.', () => __awaiter(this, void 0, void 0, function* () {
        jest.setTimeout(15000);
        yield user.setPassword('testpass');
        expect(yield user.validatePassword('testpass')).toBeTruthy();
    }));
    /**
     * Make sure non-matching passwords are rejected.
     */
    test('Can reject an invalid password', () => __awaiter(this, void 0, void 0, function* () {
        jest.setTimeout(15000);
        yield user.setPassword('testpass');
        expect(yield user.validatePassword('hunter2')).toBeFalsy();
    }));
});

//# sourceMappingURL=user.test.js.map
