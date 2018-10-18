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
const datamodule_1 = require("../../../data/datamodule");
const authenticationerror_1 = require("../common/authenticationerror");
const stringutils_1 = require("../../../util/stringutils");
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
        this.tokenManager = serviceLocator.tokenManager;
        this.userRepo = connection.getCustomRepository(datamodule_1.UserRepository);
    }
    /**
     * Login a user via their credentials.
     * @param username The user's username.
     * @param password The user's password.
     * @returns The user if successful. Otherwise null.
     */
    loginUserViaCredentials(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (stringutils_1.StringUtils.isEmpty(username) || stringutils_1.StringUtils.isEmpty(password)) {
                throw new Error('No username or password passed in!');
            }
            let user = yield this.userRepo.findByUsername(username);
            if (!user) {
                return null;
            }
            //Are they authentic?
            if (!(yield user.validatePassword(password))) {
                throw new authenticationerror_1.AuthenticationError('User is not authorized.');
            }
            //Issue them a login
            let login = new datamodule_1.UserLogin(user);
            login.token = yield this.tokenManager.issueToken(user);
            //Save it
            yield this.loginRepo.add(login);
            user.login = login;
            return user;
        });
    }
    /**
     * Login a user using a JWT they have.
     * @param token The JWT from a previous login.
     * @returns The user if successful. Otherwise null.
     */
    loginUserViaToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let payLoad = yield this.tokenManager.verifyToken(token);
            let user = yield this.userRepo.findById(payLoad.userId);
            //Issue them a login
            let login = new datamodule_1.UserLogin(user);
            login.token = yield this.tokenManager.issueToken(user);
            //Save it
            yield this.loginRepo.add(login);
            user.login = login;
            return user;
        });
    }
    /**
     * Log out a user that is currently logged in.
     * @param user The username to log out.
     * @returns True if logged out.
     */
    logoutUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.login) {
                throw new Error('User is not logged in!');
            }
            //Delete it from the db
            let success = yield this.loginRepo.delete(user.login);
            user.login = null;
            return success;
        });
    }
}
exports.LoginHandler = LoginHandler;
//# sourceMappingURL=loginhandler.js.map