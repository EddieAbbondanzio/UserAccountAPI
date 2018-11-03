"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const HttpStatusCodes = require("http-status-codes");
const stringutils_1 = require("../../../util/stringutils");
const errorhandler_1 = require("../../../common/error/errorhandler");
const validationerror_1 = require("../../../logic/validation/validationerror");
const argumenterror_1 = require("../../../common/error/types/argumenterror");
const servererrorinfo_1 = require("../../common/servererrorinfo");
const authenticate_1 = require("../../common/decorators/authenticate");
const body_1 = require("../../common/decorators/body");
const userupdate_1 = require("./userupdate");
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
        //Request to update a user
        this.expressRouter.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.updateUser(req, res); }));
        //Request to delete a user.
        this.expressRouter.delete('/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.deleteUser(req, res); }));
        //Request to check for an available username.
        this.expressRouter.head('/:username', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.isUsernameAvailable(req, res); }));
        //Request to find a user by id / email / or username.
        this.expressRouter.get('/:identifier', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.findUser(req, res); }));
        expressApp.use('/users/', this.expressRouter);
    }
    /**
     * Handle an incoming request to update a user.
     * @param request The incoming request to work with.
     * @param response The outgoing response being built.
     */
    updateUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            request.user.name = request.body.name;
            request.user.email = request.body.email;
            try {
                yield this.userService.update(request.user);
                response.sendStatus(HttpStatusCodes.OK);
            }
            catch (error) {
                console.log(error);
                response.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
            }
        });
    }
    /**
     * Handle an incoming request to delete a user.
     * @param request The incoming request to work with.
     * @param response The outgoing response being built.
     */
    deleteUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.delete(request.user);
            }
            catch (error) {
                console.log(error);
                response.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
            }
        });
    }
    /**
     * Process an incoming request to see if a useranme is available
     * via a HEAD request.
     * @param req The incoming request to work with.
     * @param response The outgoing response being built.
     */
    isUsernameAvailable(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let username = request.params.username;
            if (stringutils_1.StringUtils.isBlank(username)) {
                response.sendStatus(HttpStatusCodes.BAD_REQUEST);
                return;
            }
            try {
                let isAvail = yield this.userService.isUsernameAvailable(username);
                response.sendStatus(isAvail ? HttpStatusCodes.NOT_FOUND : HttpStatusCodes.CONFLICT);
            }
            catch (error) {
                new errorhandler_1.ErrorHandler(error)
                    .catch(argumenterror_1.ArgumentError, (aError) => {
                    response.sendStatus(HttpStatusCodes.BAD_REQUEST);
                })
                    .catch(validationerror_1.ValidationError, (vError) => {
                    response.sendStatus(HttpStatusCodes.NOT_ACCEPTABLE);
                })
                    .otherwiseRaise();
            }
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
                response.sendStatus(HttpStatusCodes.BAD_REQUEST);
                return;
            }
            try {
                //Is it a user id?
                if (stringutils_1.StringUtils.isNumeric(identifier)) {
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
                    response.sendStatus(HttpStatusCodes.NOT_FOUND);
                }
            }
            catch (error) {
                new errorhandler_1.ErrorHandler(error)
                    .catch(argumenterror_1.ArgumentError, (aError) => {
                    response.status(HttpStatusCodes.BAD_REQUEST)
                        .json(new servererrorinfo_1.ServerErrorInfo(1, aError.message));
                })
                    .otherwiseRaise();
            }
        });
    }
}
__decorate([
    authenticate_1.authenticate(),
    body_1.body(userupdate_1.UserUpdate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserHandler.prototype, "updateUser", null);
__decorate([
    authenticate_1.authenticate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserHandler.prototype, "deleteUser", null);
exports.UserHandler = UserHandler;
//# sourceMappingURL=userhandler.js.map