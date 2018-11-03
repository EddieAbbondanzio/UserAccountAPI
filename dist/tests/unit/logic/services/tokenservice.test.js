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
const tokenservice_1 = require("../../../../logic/services/tokenservice");
const chai_1 = require("chai");
require("mocha");
const chaiAsPromised = require("chai-as-promised");
const nullargumenterror_1 = require("../../../../common/error/types/nullargumenterror");
const chai = require("chai");
/**
 * Mock payload object for storing the test JWTs.
 */
class MockPayload {
    constructor(foo) {
        this.foo = foo;
    }
}
class MockPayload2 {
    constructor(bar) {
        this.bar = bar;
    }
}
/**
 * Test module for testing the Token Service.
 */
describe('TokenService', () => {
    let tokenService;
    before(() => {
        chai.use(chaiAsPromised);
        tokenService = new tokenservice_1.TokenService('secret');
    });
    describe('constructor()', () => {
        it('throws an error if no signature', () => {
            chai_1.expect(() => { new tokenservice_1.TokenService(null); })
                .to.throw(nullargumenterror_1.NullArgumentError);
        });
    });
    describe('issueToken()', () => {
        it('throws an error if no payload', () => __awaiter(this, void 0, void 0, function* () {
            yield chai_1.expect(tokenService.issueToken(undefined))
                .to.be.rejectedWith(nullargumenterror_1.NullArgumentError);
        }));
        it('issues a JWT for a valid payload', () => __awaiter(this, void 0, void 0, function* () {
            let payload = new MockPayload('cat');
            yield chai_1.expect(tokenService.issueToken(payload))
                .to.be.eventually.fulfilled.with.a('String');
        }));
    });
    describe('authenticateToken()', () => {
        it('throws an error if no token', () => __awaiter(this, void 0, void 0, function* () {
            yield chai_1.expect(tokenService.authenticateToken(null, MockPayload))
                .to.eventually.be.rejectedWith(nullargumenterror_1.NullArgumentError);
        }));
        it('returns a payload from a valid token', () => __awaiter(this, void 0, void 0, function* () {
            let payload = new MockPayload('cat');
            let jwt = yield tokenService.issueToken(payload);
            yield chai_1.expect(tokenService.authenticateToken(jwt, MockPayload))
                .to.eventually.be.fulfilled.and.deep.equal(payload);
        }));
        it('throws an error if incorrect payload', () => __awaiter(this, void 0, void 0, function* () {
            let payload = new MockPayload('cat');
            let jwt = yield tokenService.issueToken(payload);
            yield chai_1.expect(tokenService.authenticateToken(jwt, MockPayload2))
                .to.eventually.be.rejectedWith(TypeError);
        }));
    });
});
//# sourceMappingURL=tokenservice.test.js.map