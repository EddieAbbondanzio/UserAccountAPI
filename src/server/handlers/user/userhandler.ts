import { IUserService } from "../../../logic/contract/services/iuserservice";
import * as Express from 'express';
import * as HttpStatusCodes from 'http-status-codes';
import { IHandler } from "../../common/ihandler";
import { StringUtils } from "../../../util/stringutils";
import { User } from "../../../logic/models/user";
import { ErrorHandler } from "../../../common/error/errorhandler";
import { ValidationError } from "../../../logic/validation/validationerror";
import { ArgumentError } from "../../../common/error/types/argumenterror";
import { ServerErrorInfo } from "../../common/servererrorinfo";
import { ServerErrorCode } from "../../common/servererrorcode";
import { body } from "../../common/decorators/body";
import { UserRegistration } from "../../../logic/common/userregistration";
import { AccessToken } from "../../../logic/common/accesstoken";
import { IAuthService } from "../../../logic/contract/services/iauthservice";
import { IAccountService } from "../../../logic/contract/services/iaccountservice";
import { QueryFailedError } from "typeorm";
import { DuplicateError } from "../../../common/error/types/duplicateerror";
import { injectable, inject } from "inversify";
import { IOC_TYPES } from "../../../common/ioc/ioctypes";

/**
 * Router responsible for handling all incoming
 * requests related to users.
 */
@injectable()
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
     * Service for managing account info from
     * the BLL.
     */
    private accountService: IAccountService;

    /**
     * The underlying express router.
     */
    private expressRouter: Express.Router;

    /**
     * Create a new user router.
     * @param authService The auth service to use.
     * @param userService The userservice to use.
     * @param accountService The account service.
     */
    constructor(@inject(IOC_TYPES.AuthService) authService: IAuthService, 
                @inject(IOC_TYPES.UserService) userService: IUserService,
                @inject(IOC_TYPES.AccountService) accountService: IAccountService) {
        this.authService = authService;
        this.userService = userService;
        this.accountService = accountService;

        this.expressRouter = Express.Router();
    }

    /**
     * Initialize the handler for use.
     * @param expressApp The express application to work with.
     */
    public initRoutes(expressApp: Express.Application): void {
        //Register, update, or delete user
        this.expressRouter.put('/', async (req, res) => { return this.registerNewUser(req, res); });
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
            //Create the user, then send their verification email.
            let user: User = await this.userService.registerNewUser(request.body);
            await this.accountService.sendVerificationEmail(user)
            
            //Give them a log in, and send it off to them.
            let token: AccessToken = await this.authService.loginUser(user);

            response.status(HttpStatusCodes.OK)
                .json(token);
        }
        catch (error) {
            new ErrorHandler(error)
            .catch(ValidationError, (error: ValidationError) => {
                //Need to build a string of all the errors
                let errorMsg: string = error.validatorResult.errors.join('\n');

                //Fire it off to the client.
                response.status(HttpStatusCodes.BAD_REQUEST)
                .json(new ServerErrorInfo(ServerErrorCode.FailedRequest, errorMsg));
            })
            .catch(DuplicateError, (error: DuplicateError) => {
                response.status(HttpStatusCodes.CONFLICT)
                .json(new ServerErrorInfo(ServerErrorCode.FailedRequest, 'Username or email is already in use.'));
            })
            .otherwise((error: Error) => {
                console.log('An unknown error occured registering a user: ', error);

                response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(new ServerErrorInfo(ServerErrorCode.Unknown));
            });
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
                user = await this.userService.findById(id);
            }

            //Is it a username?
            else if (StringUtils.isAlphanumeric(identifier)) {
                user = await this.userService.findByUsername(identifier);
            }
            //Is it an email?
            else if (StringUtils.isEmail(identifier)) {
                user = await this.userService.findByEmail(identifier);
            }

            if (user != null) {
                response.status(HttpStatusCodes.OK).json({
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
