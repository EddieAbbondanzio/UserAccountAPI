"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const user_1 = require("../../../../logic/models/user");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
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
        it('should reject short passwords', () => {
            chai_1.expect(user.setPassword('cat')).to.be.rejected;
        });
        it('a password can be set', () => {
            chai_1.expect(user.setPassword('password')).to.be.fulfilled;
        });
    });
    describe('validatePassword()', () => {
        beforeEach(() => {
            user.setPassword('password');
        });
        it('should reject bad passwords', () => {
            chai_1.expect(user.validatePassword('notvalid')).to.eventually.be.rejected;
        });
        it('should accept valid passwords', () => {
            chai_1.expect(user.validatePassword('password')).to.be.eventually.true;
        });
    });
});
//# sourceMappingURL=user.test.js.map