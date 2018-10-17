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
const tokenmanager_1 = require("../../../../logic/authentication/common/tokenmanager");
const user_1 = require("../../../../data/user/user");
/**
 * Test module for the Token Manager utility used by the
 * Authentication handler for issuing out JWTs
 */
describe('TokenManager', () => {
    /**
     * Ensure that the token manager throws an error when
     * no secret key to use to sign tokens is passed in.
     */
    it('crashes and burns when no secret key passed in.', () => {
        expect(() => {
            let manager = new tokenmanager_1.TokenManager(undefined);
        }).toThrow();
    });
    /**
     * The token manager should act perfectly normal when a
     * valid secret key is provided.
     */
    it('creates a new token manager when a key is passed.', () => {
        expect(() => {
            let manager = new tokenmanager_1.TokenManager('CorrecHorseBatteryStaple');
        }).not.toThrow();
    });
    /**
     * An error should be thrown when no user is passed in
     * to the issue token method.
     */
    it('issueToken() throws an error when no user.', () => __awaiter(this, void 0, void 0, function* () {
        let manager = new tokenmanager_1.TokenManager('CorrecHorseBatteryStaple');
        expect(manager.issueToken(null)).rejects.toThrow();
    }));
    /**
     * An error should be thrown when the user has no id, as this
     * means they aren't in the database, and the payload will be useless.
     */
    it('issueToken() throws an error when no user id.', () => __awaiter(this, void 0, void 0, function* () {
        let manager = new tokenmanager_1.TokenManager('CorrecHorseBatteryStaple');
        let user = new user_1.User();
        expect(manager.issueToken(user)).rejects.toThrow();
    }));
    /**
     * A user can be issued a token as long as the user
     * has a user id.
     */
    it('issues tokens to users.', () => __awaiter(this, void 0, void 0, function* () {
        let manager = new tokenmanager_1.TokenManager('CorrecHorseBatteryStaple');
        let user = new user_1.User();
        user.id = 1;
        let token = yield manager.issueToken(user);
        expect(token).toBeDefined();
    }));
    /**
     * Tokens that were signed by the token manager should be
     * accepted.
     */
    it('validates legit tokens correctly', () => __awaiter(this, void 0, void 0, function* () {
        let manager = new tokenmanager_1.TokenManager('CorrecHorseBatteryStaple');
        let user = new user_1.User();
        user.id = 1;
        let token = yield manager.issueToken(user);
        let payload = yield manager.verifyToken(token);
        expect(payload.userId).toBe(user.id);
    }));
    /**
     * Tokens that weren't created by the token manager should
     * throw an error.
     */
    it('rejects illegal tokens', () => __awaiter(this, void 0, void 0, function* () {
        let manager = new tokenmanager_1.TokenManager('CorrecHorseBatteryStaple');
        expect(manager.verifyToken('NOT A TOKEN')).rejects.toThrow();
    }));
});

//# sourceMappingURL=tokenmanager.test.js.map
