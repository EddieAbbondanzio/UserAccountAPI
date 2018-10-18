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
 * Router for locating user's via their name in the url.
 * This provides functionality for /user/username for user
 * retrieval. Usernames are case insensitive to
 * prevent URL collisions.
 */
class UserRouter extends baserouter_1.BaseController {
    /**
     * Create a new user router to handle requests related
     * to getting user info.
     * @param serviceLocator The dependency locator.
     */
    constructor(serviceLocator) {
        super();
        //  this.userService = serviceLocator.userService;
    }
    /**
     * Process a request searching for a user via their username.
     * @param request The request of the caller.
     * @param response The response to send back to the caller.
     */
    getUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let username = request.params.username;
            try {
                let user = yield this.userService.findByUsername(username);
                if (user) {
                    //We only want to send SOME data back. For safety purposes
                    //we'll create a new object and return that.
                    let userInfo = {
                        username: user.username,
                        joinedDate: user.stats.joinedDate
                    };
                    response.send(userInfo);
                }
                else {
                    response.sendStatus(404);
                }
            }
            catch (error) {
                console.log('UserRouter.getUser(): Error: ', error);
                response.sendStatus(503);
            }
        });
    }
    /**
     * Initialize the methods that can
     * be accessed in this router.
     */
    init() {
        this.router.get('/:username', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.getUser(req, res); }));
    }
}
exports.UserRouter = UserRouter;
//# sourceMappingURL=userrouter.js.map