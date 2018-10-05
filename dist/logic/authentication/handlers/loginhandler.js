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
const logichandler_1 = require("../../common/logichandler");
/**
 * Business logic for the login portion of the
 * authentication component.
 */
class LoginHandler extends logichandler_1.LogicHandler {
    /**
     * Create a new login handler.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(connection, serviceLocator) {
        super(connection, serviceLocator);
    }
    /**
     * Login a user via their credentials.
     * @param username The user's username.
     * @param password The user's password.
     * @returns The user if successful. Otherwise null.
     */
    loginUserViaCredentials(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    /**
     * Login a user using a JWT they have.
     * @param token The JWT from a previous login.
     * @returns The user if successful. Otherwise null.
     */
    loginUserViaToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    /**
     * Log out a user that is currently logged in.
     * @param username The username to log out.
     * @param loginGuid Their login guid to use.
     * @returns True if logged out.
     */
    logoutUser(username, loginGuid) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
}
exports.LoginHandler = LoginHandler;

//# sourceMappingURL=loginhandler.js.map
