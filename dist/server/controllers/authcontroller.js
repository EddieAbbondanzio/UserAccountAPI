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
const baserouter_1 = require("../common/baserouter");
/**
 * Controller for handling login requests, along with validating
 *  users to see if they are who they claim
 * to be.
 */
class AuthController extends baserouter_1.BaseController {
    /**
     * Create a new instance of the authentication controller.
     * @param serviceLocator The service locator for
     * dependency inversion.
     */
    constructor(serviceLocator) {
        super();
    }
    /**
     * Process a request for a user login. This will look for
     * a JWT or username + password in the body of the request.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    loginUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('logging in!');
        });
    }
    /**
     * Process a request to log out a user that is logged in.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    logoutUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('logging out!');
        });
    }
    /**
     * Validate the login id (guid) and username passed in. If
     * the login is valid then the player id is returned. Otherwise
     * -1 is returned.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    validateUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('validating user');
        });
    }
    /**
     * Reset a users password. This expects a verification token
     * to be passed along with their new password. The verification
     * token was sent to them via their email.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    resetPassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            //This should be rate limited.
        });
    }
    /**
     * Update a users password. This expects a username, along with
     * their current password. This is rate limited.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    updatePassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            //This should be rate limited.
        });
    }
    /**
     * Initialize the router and any services that it
     * may need.
     */
    init() {
        this.router.post('/login', this.loginUser);
        this.router.post('/logout', this.logoutUser);
        this.router.put('/resetpassword', this.resetPassword);
        this.router.put('/updatepassword', this.updatePassword);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authcontroller.js.map