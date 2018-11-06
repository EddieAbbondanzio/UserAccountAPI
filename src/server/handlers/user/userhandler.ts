import { IUserService } from "../../../logic/contract/services/iuserservice";
import * as Express from 'express';
import * as HttpStatusCodes from 'http-status-codes';
import { IHandler } from "../../common/ihandler";
import { StringUtils } from "../../../util/stringutils";
import { User } from "../../../logic/models/user";
import { UsernameValidatorRule } from "../../../logic/validation/user/rules/usernamevalidatorrule";
import { ErrorHandler } from "../../../common/error/errorhandler";
import { ValidationError } from "../../../logic/validation/validationerror";
import { ArgumentError } from "../../../common/error/types/argumenterror";
import { ServerErrorInfo } from "../../common/servererrorinfo";
import { Config } from "../../../config/config";
import { authenticate } from "../../common/decorators/authenticate";
import { ServerErrorCode } from "../../common/servererrorcode";
import { body } from "../../common/decorators/body";
import { UserUpdate } from "../account/payloads/userupdate";
import { UserRegistration } from "../../../logic/common/userregistration";
import { AccessToken } from "../../../logic/common/accesstoken";
import { IAuthService } from "../../../logic/contract/services/iauthservice";

/**
 * Router responsible for handling all incoming
 * requests related to users.
 */
export class UserHandler implements IHandler {
    /**
     * The auth service from the BLL.
     */
    private authService: IAuthService;

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
     * @param authService The auth service to use.
     * @param userService The userservice to use.
     */
    constructor(authService: IAuthService, userService: IUserService) {
        this.authService = authService;
        this.userService = userService;

        this.expressRouter = Express.Router();
    }

    /**
     * Initialize the handler for use.
     * @param expressApp The express application to work with.
     */
    public initRoutes(expressApp: Express.Application): void {
        //Register, update, or delete user
        this.expressRouter.put('/', async (req, res) => { return this.registerNewUser(req, res); });
        this.expressRouter.post('/', async (req, res) => { return this.updateUser(req, res); });
        this.expressRouter.delete('/', async (req, res) => { return this.deleteUser(req, res); });
        this.expressRouter.head('/:username', async (req, res) => { return this.isUsernameAvailable(req, res); });
        this.expressRouter.get('/:identifier', async (req, res) => { return this.findUser(req, res); });

        expressApp.use('/users/', this.expressRouter);
    }

    /**
     * Register a new user with the system. This will require them to provide
     * a full user registration in the body.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    @body(UserRegistration)
    public async registerNewUser(request: Express.Request, response: Express.Response): Promise<void> {
        try {
            console.log(request.body);

            //Create the user, then log them in.
            let user: User = await this.authService.registerNewUser(request.body);
            let token: AccessToken = await this.authService.loginUser(user);

            response.status(HttpStatusCodes.OK)
                .json(token);
        }
        catch (error) {
            console.log('An error occured registering a user: ', error);

            response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .json(new ServerErrorInfo(ServerErrorCode.Unknown));
        }
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
