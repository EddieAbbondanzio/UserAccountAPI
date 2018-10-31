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
const Express = require("express");
const HTTPStatusCodes = require("http-status-codes");
const stringutils_1 = require("../../util/stringutils");
/**
 * Router responsible for handling all incoming
 * requests related to users.
 */
class UserHandler {
    /**
     * Create a new user router.
     * @param userService The userservice to use.
     */
    constructor(userService) {
        this.userService = userService;
        this.expressRouter = Express.Router();
    }
    /**
     * Initialize the handler for use.
     * @param expressApp The express application to work with.
     */
    initRoutes(expressApp) {
        this.expressRouter.head('/:username', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.isUsernameAvailable(req, res); }));
        this.expressRouter.get('/:identifier', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.findUser(req, res); }));
        expressApp.use('/users/', this.expressRouter);
    }
    /**
     * Process an incoming request to see if a useranme is available
     * via a HEAD request.
     * @param req The incoming request to work with.
     * @param response The outgoing response being built.
     */
    isUsernameAvailable(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('HEAD');
            response.sendStatus(HTTPStatusCodes.PARTIAL_CONTENT);
        });
    }
    /**
     * Process a request for a user via GET. This expects a
     * parameter of either a user id, email, or username.
     * @param request The incoming request to work with.
     * @param response The outgoing response being built.
     */
    findUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let identifier = request.params.identifier;
            let user;
            if (stringutils_1.StringUtils.isBlank(identifier)) {
                response.sendStatus(HTTPStatusCodes.BAD_REQUEST);
            }
            //Is it a user id?
            else if (stringutils_1.StringUtils.isNumeric(identifier)) {
                let id = parseInt(identifier, 10);
                let user = yield this.userService.findById(id);
            }
            //Is it a username?
            else if (stringutils_1.StringUtils.isAlphanumeric(identifier)) {
                let user = yield this.userService.findByUsername(identifier);
            }
            //Is it an email?
            else if (stringutils_1.StringUtils.isEmail(identifier)) {
                let user = yield this.userService.findByEmail(identifier);
            }
            if (user != null) {
                response.send({
                    id: user.id,
                    username: user.username,
                    stats: user.stats
                });
            }
            else {
                response.sendStatus(HTTPStatusCodes.NOT_FOUND);
            }
        });
    }
}
exports.UserHandler = UserHandler;
//# sourceMappingURL=userhandler.js.map