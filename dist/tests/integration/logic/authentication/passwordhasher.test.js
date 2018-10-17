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
const passwordhasher_1 = require("../../../../logic/authentication/common/passwordhasher");
/**
 * Test module for the PasswordHasher
 */
describe('PasswordHasher', () => {
    /**
     * No password passed should result in an error.
     */
    it('Should throw an error when no password is passed.', () => __awaiter(this, void 0, void 0, function* () {
        yield expect(passwordhasher_1.PasswordHasher.generateHash(undefined)).rejects.toThrow();
    }));
    /**
     * Null passwords should never be hashed.
     */
    it('Should throw an error when null is passed.', () => __awaiter(this, void 0, void 0, function* () {
        yield expect(passwordhasher_1.PasswordHasher.generateHash(null)).rejects.toThrow();
    }));
    /**
     * Blank passwords should be forbidden, and an error should
     * always be thrown.
     */
    it('Should throw an error when a blank password is passed', () => __awaiter(this, void 0, void 0, function* () {
        yield expect(passwordhasher_1.PasswordHasher.generateHash('   ')).rejects.toThrow();
    }));
    /**
     * Check to ensure that it can successfully hash passwords.
     */
    it('Should properly hash a password.', () => __awaiter(this, void 0, void 0, function* () {
        let hash = yield passwordhasher_1.PasswordHasher.generateHash('Hunter2');
        expect(hash).toBeDefined();
    }));
    /**
     * When no password is passed into the validate method an
     * error should be thrown.
     */
    it('An error is thrown when no password to validate', () => __awaiter(this, void 0, void 0, function* () {
        yield expect(passwordhasher_1.PasswordHasher.validateHash(undefined, 'HASH')).rejects.toThrow();
    }));
    /**
     * When no hash is passed into the validate method an error
     * should be thrown.
     */
    it('An error is thrown when no hash is passed in to validate.', () => __awaiter(this, void 0, void 0, function* () {
        yield expect(passwordhasher_1.PasswordHasher.validateHash('PASS', undefined)).rejects.toThrow();
    }));
    /**
     * A password that is hashed should be able to be validated
     * later on.
     */
    it('A password hash generated, can be verified later on.', () => __awaiter(this, void 0, void 0, function* () {
        let hash = yield passwordhasher_1.PasswordHasher.generateHash('Hunter2');
        let isValid = yield passwordhasher_1.PasswordHasher.validateHash('Hunter2', hash);
        expect(isValid).toBe(true);
    }));
    /**
     * An incorrect password should return false when it doesn't
     * match a hash.
     */
    it('An incorrect password does not match a hash', () => __awaiter(this, void 0, void 0, function* () {
        let hash = yield passwordhasher_1.PasswordHasher.generateHash('Hunter2');
        let isValid = yield passwordhasher_1.PasswordHasher.validateHash('Password', hash);
        expect(isValid).toBe(false);
    }));
});

//# sourceMappingURL=passwordhasher.test.js.map
