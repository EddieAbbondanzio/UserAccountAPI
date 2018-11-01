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
const nullargumenterror_1 = require("../../common/error/types/nullargumenterror");
/**
 * Hasher utility for creating new password hashes and
 * validating passed in passwords.
 */
var PasswordHasher;
(function (PasswordHasher) {
    /**
     * Generate a new password hash from a passed in hash.
     * @param password The password to hash
     */
    function generateHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (password == null) {
                throw new nullargumenterror_1.NullArgumentError('password');
            }
            //The # is saltRounds. Currently 10 is default.
            return yield BcryptJS.hash(password, 10);
        });
    }
    PasswordHasher.generateHash = generateHash;
    /**
     * Hashes a passed in password and compares it against the
     * known password hash
     * @param password The password to hash and check.
     * @param hash The hash to compare against.
     */
    function validateHash(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (password == null) {
                throw new nullargumenterror_1.NullArgumentError('password');
            }
            else if (hash == null) {
                throw new nullargumenterror_1.NullArgumentError('hash');
            }
            return yield BcryptJS.compare(password, hash);
        });
    }
    PasswordHasher.validateHash = validateHash;
})(PasswordHasher = exports.PasswordHasher || (exports.PasswordHasher = {}));
//# sourceMappingURL=passwordhasher.js.map