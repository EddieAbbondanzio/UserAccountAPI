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
const user_1 = require("../../../data/user/user");
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
     * Typeorm doesn't want any values defaulted
     * when creating a new instance.
     */
    test('Initialized with an id of undefined.', () => {
        expect(user.id).toBeUndefined();
    });
    /**
     * Typeorm doesn't want any values defaulted.
     */
    test('Initialized with a username of undefined.', () => {
        expect(user.username).toBeUndefined();
    });
    /**
     * Typeorm doesn't want any values defaulted.
     */
    test('Initialized with a password hash of undefined.', () => {
        expect(user.passwordHash).toBeUndefined();
    });
    /**
     * Typeorm doesn't want any values defaulted.
     */
    test('Initialized with a name of undefined.', () => {
        expect(user.name).toBeUndefined();
    });
    /**
     * Typeorm doesn't want any values defaulted.
     */
    test('Initialized with an email of undefined.', () => {
        expect(user.email).toBeUndefined();
    });
    /**
     * Check that the isVerified is always false when creating
     * a new user.
     */
    test('Initialized with an isVerified of undefined.', () => {
        expect(user.isVerified).toBeUndefined();
    });
    /**
     * Verify that the isDeleted status is always false
     * when creating a new user.
     */
    test('Initialized with an isDeleted of undefined.', () => {
        expect(user.isDeleted).toBeUndefined();
    });
    /**
     * Passwords shorter than the min length will throw an
     * error.
     */
    test('Can not set a password shorter than the min.', () => __awaiter(this, void 0, void 0, function* () {
        yield expect(user.setPassword('a')).rejects.toThrow();
    }));
    /**
     * Ensure a password is properly set on the suer.
     */
    test('Can set a valid password.', () => __awaiter(this, void 0, void 0, function* () {
        yield user.setPassword('testpass');
        expect(user.passwordHash).toBeDefined();
    }));
    /**
     * Ensure that a password is matched up after
     * hashing.
     */
    test('Can verify matching password.', () => __awaiter(this, void 0, void 0, function* () {
        yield user.setPassword('testpass');
        yield expect(yield user.validatePassword('testpass')).toBe(true);
    }));
    /**
     * Make sure non-matching passwords are rejected.
     */
    test('Can reject an invalid password', () => __awaiter(this, void 0, void 0, function* () {
        yield user.setPassword('testpass');
        yield expect(yield user.validatePassword('hunter2')).toBe(false);
    }));
});

//# sourceMappingURL=user.test.js.map
