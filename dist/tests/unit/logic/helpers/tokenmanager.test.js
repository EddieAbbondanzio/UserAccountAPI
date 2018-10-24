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
const tokenmanager_1 = require("../../../../logic/helpers/tokenmanager");
const user_1 = require("../../../../logic/models/user");
describe('TokenManager', () => {
    let tokenManager;
    before(() => {
        tokenManager = new tokenmanager_1.TokenManager('supersecretpasswordthatisnothunter2');
    });
    describe('issueToken()', () => {
        it('should throw an error if no user', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(tokenManager.issueToken(undefined)).to.eventually.be.rejected;
        }));
        it('should throw an error if no id on the user', () => __awaiter(this, void 0, void 0, function* () {
            let user = new user_1.User();
            chai_1.expect(tokenManager.issueToken(user)).to.eventually.be.rejected;
        }));
        it('should issue a token for a user', () => __awaiter(this, void 0, void 0, function* () {
            let user = new user_1.User();
            user.id = 117;
            chai_1.expect(tokenManager.issueToken(user)).to.eventually.be.fulfilled;
        }));
    });
    describe('verifyToken()', () => {
        it('should return null for bad tokens', () => __awaiter(this, void 0, void 0, function* () {
            let token = 'notatoken';
            chai_1.expect(tokenManager.verifyToken(token)).to.eventually.be.null;
        }));
        it('should return a payload for valid tokens', () => __awaiter(this, void 0, void 0, function* () {
            let user = new user_1.User();
            user.id = 117;
            let token = yield tokenManager.issueToken(user);
            chai_1.expect(tokenManager.verifyToken(token)).to.eventually.be.a('object').with.property('userId', 117);
        }));
    });
});
//# sourceMappingURL=tokenmanager.test.js.map