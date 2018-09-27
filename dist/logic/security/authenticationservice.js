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
const service_1 = require("../common/service");
const datamodule_1 = require("../../data/datamodule");
const passwordhasher_1 = require("./passwordhasher");
const tokenmanager_1 = require("./tokenmanager");
/**
 * The service used by the server to process login
 * requests, and check requests made for a login token.
 */
class AuthenticationService extends service_1.Service {
    /**
     * Get a new LoginService up and running.
     * @param connection The underlying database connection.
     */
    constructor(connection) {
        super(connection);
        this.passwordHasher = new passwordhasher_1.PasswordHasher();
        this.tokenManager = new tokenmanager_1.TokenManager();
        this.userRepository = connection.getCustomRepository(datamodule_1.UserRepository);
        this.loginRepository = connection.getCustomRepository(datamodule_1.UserLoginRepository);
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
            let userLogin = datamodule_1.UserLogin.GenerateLogin(user);
            yield this.loginRepository.add(userLogin);
            return userLogin;
        });
    }
    /**
     * Log out an already logged in user. This will invalidate their
     * login
     * @param username The username of the user to log out.
     * @param guid The unique id of the login
     */
    logoutUser(guid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loginRepository.deleteByGuid(guid);
        });
    }
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
                let userLogin = yield this.loginRepository.findByGuid(guid);
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
                let userLogin = datamodule_1.UserLogin.GenerateLogin(user);
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
exports.AuthenticationService = AuthenticationService;

//# sourceMappingURL=authenticationservice.js.map
