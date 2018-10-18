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
const typeorm_1 = require("typeorm");
const servicelocator_1 = require("../../../../../logic/servicelocator");
const loginhandler_1 = require("../../../../../logic/authentication/handlers/loginhandler");
/**
 * Test module for the Login Handler.
 */
describe('LoginHandler', () => {
    /**
     * The test login handler to work with.
     */
    let loginHandler;
    /**
     * Prepare the dependencies for use.
     */
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        let connection = yield typeorm_1.createConnection();
        let serviceLocator = new servicelocator_1.ServiceLocator();
        loginHandler = new loginhandler_1.LoginHandler(connection, serviceLocator);
    }));
    /**
     * Test module for every test related to the loginUserViaCredentials()
     * method of the Login Handler.
     */
    describe('loginUserViaCredentials()', () => {
        /**
         * When no username is passed in the method should throw
         * an error.
         */
        it('should throw an error is no username.', () => __awaiter(this, void 0, void 0, function* () {
            yield expect(loginHandler.loginUserViaCredentials(undefined, 'PASS')).rejects.toThrow();
        }));
        /**
         * When no password is passed in the method should throw
         * an error.
         */
        it('should throw an error if no password.', () => __awaiter(this, void 0, void 0, function* () {
            yield expect(loginHandler.loginUserViaCredentials('USER', undefined)).rejects.toThrow();
        }));
        /**
         * If no user with the username passed in was found, it should
         * return null.
         */
        it('returns null if no user found.', () => __awaiter(this, void 0, void 0, function* () {
            yield expect(loginHandler.loginUserViaCredentials('USER', 'PASS')).toBeNull();
        }));
        /**
         * If the password passed in does not match the current password,
         * an error should be thrown.
         */
        it('should return null when bad password.', () => __awaiter(this, void 0, void 0, function* () {
            yield expect(loginHandler.loginUserViaCredentials('USER', 'PASS')).toBeNull();
        }));
        /**
         * If the username and password match a user in the database, the
         * user should be returned.
         */
        it('should return a user if valid credentials passed.', () => __awaiter(this, void 0, void 0, function* () {
        }));
        /**
         * If the user is properly logged in they should have a new user
         * login tied to them with a JWT.
         */
        it('should return a user with a login that has a JWT', () => __awaiter(this, void 0, void 0, function* () {
        }));
    });
    /**
     * Test module for the loginUserViaToken method of the LoginHandler.
     */
    describe('loginUserViaToken()', () => {
        /**
         * When no token is passed, null should be returned.
         */
        it('', () => __awaiter(this, void 0, void 0, function* () {
        }));
        /**
         * When an invalid token is passed, null should be returned.
         */
        it('', () => __awaiter(this, void 0, void 0, function* () {
        }));
        /**
         * When a valid token is passed a user should be returned.
         */
        it('', () => __awaiter(this, void 0, void 0, function* () {
        }));
        /**
        * When a valid token is passed a user should be returned with
        * a user login that has a new JWT with it.
        */
        it('', () => __awaiter(this, void 0, void 0, function* () {
        }));
    });
    /**
     * Test module for the logoutUser method of the LoginHandler.
     */
    describe('logoutUser()', () => {
        //logout user no user
        //logout user no logged in user
        //logout user valid
    });
});
//# sourceMappingURL=loginhandler.test.js.map