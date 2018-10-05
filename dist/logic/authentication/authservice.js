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
const datamodule_1 = require("../../data/datamodule");
const tokenmanager_1 = require("./common/tokenmanager");
/**
 * The service used by the server to process login
 * requests, and check requests made for a login token.
 */
class AuthService {
    /**
     * Get a new LoginService up and running.
     * @param connection The underlying database connection.
     * @param emailService The service to send emails.
     * @param tokenKey The secret encryption key for JWTs.
     */
    constructor(connection, emailService, tokenKey) {
        this.emailService = emailService;
        this.tokenManager = new tokenmanager_1.TokenManager(tokenKey);
        this.userRepository = connection.getCustomRepository(datamodule_1.UserRepository);
        this.loginRepository = connection.getCustomRepository(datamodule_1.UserLoginRepository);
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
    /**
     * Reset a user's password after verifying their token is valid.
     * @param username The username of the user.
     * @param passwordToken Their temporary access password.
     * @param newPassword Their new desired password.
     * @returns True if the token was valid.
     */
    resetPassword(username, passwordToken, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    /**
     * Update a user's password. This only proceeds if their current
     * password passed in is valid.
     * @param username The username of the user.
     * @param currPassword Their current password.
     * @param newPassword Their new desired password.
     * @returns True if successful.
     */
    updatePassword(username, currPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    /**
     * Validate that a user is who they claim to be. This will check their username
     * against the login provided in the database.
     * @param username The username of the user.
     * @param loginGuid Their login guid.
     * @returns True if the user is who they claim to be.
     */
    validateUser(username, loginGuid) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    /**
     * Log in an existing user by checking the database for a match.
     * @param username The username to log in under.
     * @param password Their password to verify.
     * @returns The user login if successful.
     */
    loginUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findByUsername(username);
            //If no user was found, fail the login
            if (user == null) {
                return null;
            }
            //Now verify credentials.
            if (!(yield user.validatePassword(password))) {
                return null;
            }
            //Build the new login, and save it so we
            //can get it's unique login id.
            let userLogin = datamodule_1.UserLogin.generateLogin(user);
            yield this.loginRepository.add(userLogin);
            return userLogin;
        });
    }
    // /**
    //  * Log out an already logged in user. This will invalidate their
    //  * login
    //  * @param username The username of the user to log out.
    //  * @param guid The unique id of the login
    //  */
    // public async logoutUser(guid: string) {
    //     await this.loginRepository.deleteByGuid(guid);
    // }
    /**
     * Attempts to validate a loginId that a user passed to a game server. This
     * checkes if the login is actually valid and stored in the database.
     * @param username The username of the user who's login we need to validate.
     * @param guid The GUID of the login. This needs to be checked.
     * @returns True if the login is legitimate.
     */
    validateLogin(username, guid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userLogin = null; //await this.loginRepository.findByGuid(guid);
                if (userLogin) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                return false;
            }
        });
    }
    /**
     * Refresh a user login and provide them with a new unique GUID. This
     * will let them keep using their JWT since it has a log expiration
     * date.
     * @param loginToken: The JWT of the user.
     * @returns A user login if the request was authentic.
     */
    refreshLogin(loginToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = yield this.tokenManager.verifyToken(loginToken);
            if (payload) {
                let user = yield this.userRepository.findById(payload.userId);
                if (!user) {
                    throw new Error("Failed to find user");
                }
                let userLogin = datamodule_1.UserLogin.generateLogin(user);
                yield this.loginRepository.add(userLogin);
                return userLogin;
            }
            else {
                throw new Error("Invalid login token");
            }
        });
    }
    /**
     * Validate the token and try to get the user from it.
     * @param loginToken The JWT to extract info from.
     */
    validateToken(loginToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = yield this.tokenManager.verifyToken(loginToken);
            if (payload) {
                let user = yield this.userRepository.findById(payload.userId);
                if (!user) {
                    throw new Error("Failed to find user");
                }
                return user;
            }
            else {
                throw new Error("Invalid login token");
            }
        });
    }
}
exports.AuthService = AuthService;

//# sourceMappingURL=authservice.js.map
