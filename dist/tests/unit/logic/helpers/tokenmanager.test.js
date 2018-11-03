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
const nullargumenterror_1 = require("../../../../common/error/types/nullargumenterror");
const argumenterror_1 = require("../../../../common/error/types/argumenterror");
const authenticationerror_1 = require("../../../../common/error/types/authenticationerror");
describe('TokenManager', () => {
    let tokenManager;
    before(() => {
        tokenManager = new tokenmanager_1.TokenManager('supersecretpasswordthatisnothunter2');
    });
    describe('issueToken()', () => __awaiter(this, void 0, void 0, function* () {
        it('should throw an error if no user', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(tokenManager.issueToken(undefined)).to.eventually.be.rejectedWith(nullargumenterror_1.NullArgumentError);
        }));
        it('should throw an error if no id on the user', () => __awaiter(this, void 0, void 0, function* () {
            let user = new user_1.User();
            chai_1.expect(tokenManager.issueToken(user)).to.eventually.be.rejectedWith(argumenterror_1.ArgumentError);
        }));
        it('should issue a token for a user', () => __awaiter(this, void 0, void 0, function* () {
            let user = new user_1.User();
            user.id = 117;
            chai_1.expect(tokenManager.issueToken(user)).to.eventually.be.fulfilled;
        }));
    }));
    describe('verifyToken()', () => __awaiter(this, void 0, void 0, function* () {
        it('throws an error for bad tokens', () => __awaiter(this, void 0, void 0, function* () {
            let token = 'notatoken';
            chai_1.expect(tokenManager.authenticateToken(token)).to.eventually.be.rejectedWith(authenticationerror_1.AuthenticationError);
        }));
        it('returns a payload for valid tokens', () => __awaiter(this, void 0, void 0, function* () {
            let user = new user_1.User();
            user.id = 117;
            let token = yield tokenManager.issueToken(user);
            return chai_1.expect(tokenManager.authenticateToken(token)).to.eventually.be.fulfilled;
        }));
    }));
});
//# sourceMappingURL=tokenmanager.test.js.map