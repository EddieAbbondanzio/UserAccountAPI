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
const user_1 = require("../../../../logic/models/user");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const userregistration_1 = require("../../../../logic/common/userregistration");
describe('User', () => {
    let user;
    /**
     * Need to register middleware
     */
    before(() => {
        chai.use(chaiAsPromised);
    });
    /**
     * Reset the user each test
     */
    beforeEach(() => {
        user = new user_1.User();
    });
    describe('constructor()', () => {
        it('no params leaves it empty', () => {
            chai_1.expect(user).to.be.an('object').that.is.empty;
        });
    });
    describe('setPassword()', () => {
        it('should reject short passwords', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(user.setPassword('cat')).to.be.rejected;
        }));
        it('a password can be set', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(user.setPassword('password')).to.be.fulfilled;
        }));
    });
    describe('validatePassword()', () => {
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            yield user.setPassword('password');
        }));
        it('should reject bad passwords', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(user.validatePassword('notvalid')).to.be.eventually.false;
        }));
        it('should accept valid passwords', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(user.validatePassword('password')).to.be.eventually.true;
        }));
    });
    describe('fromRegistration()', () => __awaiter(this, void 0, void 0, function* () {
        user = yield user_1.User.fromRegistration(new userregistration_1.UserRegistration('username', 'password', 'name', 'email'));
        it('username should match', () => {
            chai_1.expect(user.username).to.equal('username');
        });
        it('password should be defined', () => {
            chai_1.expect(user.passwordHash).to.be.a('string');
        });
        it('name is a match', () => {
            chai_1.expect(user.name).to.equal('name');
        });
        it('email is a match', () => {
            chai_1.expect(user.email).to.equal('email');
        });
    }));
});
//# sourceMappingURL=user.test.js.map