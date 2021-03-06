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
const chai_1 = require("chai");
require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const passwordhasher_1 = require("../../../../logic/helpers/passwordhasher");
const nullargumenterror_1 = require("../../../../common/error/types/nullargumenterror");
describe('PasswordHasher', () => {
    /**
     * Need to register middleware
     */
    before(() => {
        chai.use(chaiAsPromised);
    });
    describe('generateHash()', () => __awaiter(this, void 0, void 0, function* () {
        it('throws an error when no password passed', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(passwordhasher_1.PasswordHasher.generateHash(undefined)).to.be.rejectedWith(nullargumenterror_1.NullArgumentError, 'password');
        }));
        it('generates a hash when a password is given', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(passwordhasher_1.PasswordHasher.generateHash('password')).to.eventually.be.fulfilled;
        }));
    }));
    describe('validateHash()', () => __awaiter(this, void 0, void 0, function* () {
        it('throws an error when no password', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(passwordhasher_1.PasswordHasher.validateHash(undefined, 'hash')).to.be.rejectedWith(nullargumenterror_1.NullArgumentError, 'password');
        }));
        it('throws an error when no hash is given', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(passwordhasher_1.PasswordHasher.validateHash('pass', undefined)).to.be.rejectedWith(nullargumenterror_1.NullArgumentError, 'hash');
        }));
        it('returns true for a valid password', () => __awaiter(this, void 0, void 0, function* () {
            let hash = yield passwordhasher_1.PasswordHasher.generateHash('password');
            chai_1.expect(passwordhasher_1.PasswordHasher.validateHash('password', hash)).to.eventually.be.fulfilled.and.be.true;
        }));
        it('rejects a bad password', () => __awaiter(this, void 0, void 0, function* () {
            let hash = yield passwordhasher_1.PasswordHasher.generateHash('password');
            chai_1.expect(passwordhasher_1.PasswordHasher.validateHash('notit', hash)).to.eventually.be.fulfilled.and.be.false;
        }));
    }));
});
//# sourceMappingURL=passwordhasher.test.js.map