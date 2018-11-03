import { IUserService } from "../../../logic/contract/services/iuserservice";
import * as Express from 'express';
import * as HttpStatusCodes from 'http-status-codes';
import { IHandler } from "../../common/ihandler";
import { StringUtils } from "../../../util/stringutils";
import { User } from "../../../logic/models/user";
import { UserUsernameValidatorRule } from "../../../logic/validation/user/rules/userusernamevalidatorrule";
import { ErrorHandler } from "../../../common/error/errorhandler";
import { ValidationError } from "../../../logic/validation/validationerror";
import { ArgumentError } from "../../../common/error/types/argumenterror";
import { ServerErrorInfo } from "../../common/servererrorinfo";
import { Config } from "../../../config/config";
import { authenticate } from "../../common/decorators/authenticate";
import { ServerErrorCode } from "../../common/servererrorcode";
import { body } from "../../common/decorators/body";
import { UserUpdate } from "./userupdate";

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
        //Request to update a user
        this.expressRouter.post('/', async (req, res) => { return this.updateUser(req, res); });

        //Request to delete a user.
        this.expressRouter.delete('/', async (req, res) => { return this.deleteUser(req, res); });

        //Request to check for an available username.
        this.expressRouter.head('/:username', async (req, res) => { return this.isUsernameAvailable(req, res); });

        //Request to find a user by id / email / or username.
        this.expressRouter.get('/:identifier', async (req, res) => { return this.findUser(req, res); });

        expressApp.use('/users/', this.expressRouter);
    }

    /**
     * Handle an incoming request to update a user.
     * @param request The incoming request to work with.
     * @param response The outgoing response being built.
     */
    @authenticate()
    @body(UserUpdate)
    private async updateUser(request: Express.Request, response: Express.Response): Promise<void> {
        request.user.name  = request.body.name;
        request.user.email = request.body.email;

        try {
            await this.userService.update(request.user);
            response.sendStatus(HttpStatusCodes.OK);
        }
        catch(error){
            console.log(error);
            response.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Handle an incoming request to delete a user.
     * @param request The incoming request to work with.
     * @param response The outgoing response being built.
     */
    @authenticate()
    private async deleteUser(request: Express.Request, response: Express.Response): Promise<void> {
        try {
            await this.userService.delete(request.user);
        }
        catch(error){
            console.log(error);
            response.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Process an incoming request to see if a useranme is available
     * via a HEAD request.
     * @param req The incoming request to work with.
     * @param response The outgoing response being built.
     */
    private async isUsernameAvailable(request: Express.Request, response: Express.Response): Promise<void> {
        let username: string = request.params.username;

        if (StringUtils.isBlank(username)) {
            response.sendStatus(HttpStatusCodes.BAD_REQUEST);
            return;
        }

        try {
            let isAvail: boolean = await this.userService.isUsernameAvailable(username);
            response.sendStatus(isAvail ? HttpStatusCodes.NOT_FOUND : HttpStatusCodes.CONFLICT);
        }
        catch (error) {
            new ErrorHandler(error)
                .catch(ArgumentError, (aError: ArgumentError) => {
                    response.sendStatus(HttpStatusCodes.BAD_REQUEST);
                })
                .catch(ValidationError, (vError: ValidationError) => {
                    response.sendStatus(HttpStatusCodes.NOT_ACCEPTABLE);
                })
                .otherwiseRaise();
        }
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

        if (StringUtils.isBlank(identifier)) {
            response.sendStatus(HttpStatusCodes.BAD_REQUEST);
            return;
        }

        try {
            //Is it a user id?
            if (StringUtils.isNumeric(identifier)) {
                let id: number = parseInt(identifier, 10);
                let user = await this.userService.findById(id);
            }

            //Is it a username?
            else if (StringUtils.isAlphanumeric(identifier)) {
                let user = await this.userService.findByUsername(identifier);
            }
            //Is it an email?
            else if (StringUtils.isEmail(identifier)) {
                let user = await this.userService.findByEmail(identifier);
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
            new ErrorHandler(error)
                .catch(ArgumentError, (aError: ArgumentError) => {
                    response.status(HttpStatusCodes.BAD_REQUEST)
                        .json(new ServerErrorInfo(1, aError.message));
                })
                .otherwiseRaise();
        }
    }
}
