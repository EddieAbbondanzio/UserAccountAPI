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
const BcryptJS = require("bcryptjs");
/**
 * Hasher utility for creating new password hashes and
 * validating passed in passwords.
 */
class PasswordHasher {
    /**
     * Generate a new password hash from a passed in hash.
     * @param password The password to hash
     */
    static generateHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            //Don't hash an empty or null password.
            if (typeof password !== 'string') {
                return null;
            }
            return yield BcryptJS.hash(password, 16);
        });
    }
    /**
     * Hashes a passed in password and compares it against the
     * known password hash
     * @param password The password to hash and check.
     * @param hash The hash to compare against.
     */
    static validateHash(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof password !== 'string' || typeof hash !== 'string') {
                return false;
            }
            return yield BcryptJS.compare(password, hash);
        });
    }
}
exports.PasswordHasher = PasswordHasher;

//# sourceMappingURL=passwordhasher.js.map
