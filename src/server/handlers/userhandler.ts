import { IUserService } from "../../logic/services/iuserservice";
import * as Express from 'express';
import * as HTTPStatusCodes from 'http-status-codes';
import { IHandler } from "../common/ihandler";
import { StringUtils } from "../../util/stringutils";
import { User } from "../../logic/models/user";

/**
 * Router responsible for handling all incoming
 * requests related to users.
 */
export class UserHandler implements IHandler {
    /**
     * The user service from the BLL.
     */
    private userService: IUserService;

    /**
     * The underlying express router.
     */
    private expressRouter: Express.Router;

    /**
     * Create a new user router.
     * @param userService The userservice to use.
     */
    constructor(userService: IUserService) {
        this.userService = userService;
        this.expressRouter = Express.Router();
    }

    /**
     * Initialize the handler for use.
     * @param expressApp The express application to work with.
     */
    public initRoutes(expressApp: Express.Application): void {
        this.expressRouter.head('/:username', async(req, res) => { return this.isUsernameAvailable(req, res); });
        this.expressRouter.get('/:identifier', async (req, res) => { return this.findUser(req, res); });

        expressApp.use('/users/', this.expressRouter);
    }

    /**
     * Process an incoming request to see if a useranme is available
     * via a HEAD request.
     * @param req The incoming request to work with.
     * @param response The outgoing response being built.
     */
    private async isUsernameAvailable(request: Express.Request, response: Express.Response): Promise<void> {
        let username: string = request.params.username;

        if(StringUtils.isBlank(username)){
            response.sendStatus(HTTPStatusCodes.BAD_REQUEST);
        }
        else if()

    }

    /**
     * Process a request for a user via GET. This expects a
     * parameter of either a user id, email, or username.
     * @param request The incoming request to work with.
     * @param response The outgoing response being built.
     */
    private async findUser(request: Express.Request, response: Express.Response): Promise<void> {
        let identifier: string = request.params.identifier;
        let user: User;

        if(StringUtils.isBlank(identifier)){
            response.sendStatus(HTTPStatusCodes.BAD_REQUEST);
        }
        //Is it a user id?
        else if(StringUtils.isNumeric(identifier)){
            let id: number = parseInt(identifier, 10);
            let user = await this.userService.findById(id);
        }
        //Is it a username?
        else if(StringUtils.isAlphanumeric(identifier)) {
            let user = await this.userService.findByUsername(identifier);
        }
        //Is it an email?
        else if(StringUtils.isEmail(identifier)) {
            let user = await this.userService.findByEmail(identifier);
        }

        if(user != null){
            response.send({
                id: user.id,
                username: user.username,
                stats: user.stats
            });
        }
        else {
            response.sendStatus(HTTPStatusCodes.NOT_FOUND);
        }
    }
}