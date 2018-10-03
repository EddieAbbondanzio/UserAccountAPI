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
const HttpStatus = require("http-status-codes");
const datamodule_1 = require("../../data/datamodule");
/**
 * Controller for handling user related requests. This
 * offers functionality such as registering, retrieving
 * a lost username, or resetting a password.
 */
class UserController extends baserouter_1.BaseController {
    /**
     * Create a new instance of the user controller.
     * @param serviceLocator The service locator for
     * dependency inversion.
     */
    constructor(serviceLocator) {
        super();
        this.userService = serviceLocator.userService;
    }
    /**
     * Register a new user with the system. This will return status 201
     * if completed with no error.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    registerUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let userReg = new datamodule_1.UserRegistration();
            userReg.username = request.body.username;
            userReg.password = request.body.password;
            userReg.email = request.body.email;
            userReg.name = request.body.name;
            if (yield this.userService.register(userReg)) {
                response.sendStatus(HttpStatus.CREATED);
            }
            else {
                response.sendStatus(HttpStatus.CONFLICT);
            }
        });
    }
    /**
     * User forgot their username. Send them an email with it.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    forgotUsername(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not implemented");
        });
    }
    /**
     * User forgot their password. Send them an email with a code
     * that can be used to reset it.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    forgotPassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not implemented");
        });
    }
    /**
     * Is the username passed in available? Returns 200 OK if it is.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    isUsernameAvailable(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.params) {
                let username = request.params.username;
                if (username && (yield this.userService.isUsernameAvailable(username))) {
                    response.sendStatus(HttpStatus.OK);
                }
            }
            response.sendStatus(HttpStatus.NOT_FOUND);
        });
    }
    /**
     * Initialize the router and any services that it
     * may need.
     */
    init() {
        this.router.post('/login', this.registerUser);
        this.router.post('/forgotusername', this.forgotUsername);
        this.router.post('/forgotpassword', this.forgotUsername);
        this.router.get('/isusernameavailable/:username', this.isUsernameAvailable);
    }
}
exports.UserController = UserController;

//# sourceMappingURL=usercontroller.js.map
