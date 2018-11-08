import * as Express from 'express';
import * as HttpStatusCodes from 'http-status-codes';
import { IHandler } from "../../common/ihandler";
import { IAuthService } from "../../../logic/contract/services/iauthservice";
import { ExpressUtils } from '../../../util/expressutils';
import { AccessToken } from '../../../logic/common/accesstoken';
import { ServerErrorInfo } from '../../common/servererrorinfo';
import { ServerErrorCode } from '../../common/servererrorcode';
import { ErrorHandler } from '../../../common/error/errorhandler';
import { AuthenticationError } from '../../../common/error/types/authenticationerror';
import { authenticate } from '../../common/decorators/authenticate';
import { body } from '../../common/decorators/body';
import { User } from '../../../logic/models/user';
import { ValidateLoginPayload } from './payloads/validateloginpayload';
import { LoginCredentialsPayload } from './payloads/logincredentialspayload';
import { IUserService } from '../../../logic/contract/services/iuserservice';
import { injectable, inject } from 'inversify';
import { IOC_TYPES } from '../../../common/ioc/ioctypes';

/**
 * Router responsible for handling all incoming 
 * requests related to authentication, and more.
 */
@injectable()
export class AuthHandler implements IHandler {
    /**
     * The auth service from the BLL.
     */
    private authService: IAuthService;

    /**
     * The user service from the BLL.
     */
    private userService: IUserService;

    /**
     * Handles all of the network stuff...
     */
    private expressRouter: Express.Router;

    /**
     * Create a new auth handler.
     * @param authService The authservice to use.
     * @param userService The user service to use.
     */
    constructor(@inject(IOC_TYPES.AuthService) authService: IAuthService,
                @inject(IOC_TYPES.UserService) userService: IUserService) {
        this.authService = authService;
        this.userService = userService;

        this.expressRouter = Express.Router();
    }

    /**
     * Initialize the handler for use.
     * @param expressApp The express application to work with.
     * 
     */
    public initRoutes(expressApp: Express.Application): void {
        this.expressRouter.put('/login/', async (req, res) => { return this.loginUser(req, res); });
        this.expressRouter.delete('/login/', async (req, res) => { return this.logoutUser(req, res); });
        this.expressRouter.post('/validate/', async (req, res) => { return this.validateUserLogin(req, res); });

        expressApp.use('/auth/', this.expressRouter);
    }

    /**
     * Process a request to log in a user either throw a JWT
     * or the body containing a username, and password.
     * @param request The incoming client request.
     * @param response The response being beu
     */
    @body(LoginCredentialsPayload, {optional: true})
    public async loginUser(request: Express.Request, response: Express.Response): Promise<void> {
        let bearerToken: string = ExpressUtils.getBearerToken(request);
        let accessToken: AccessToken;

        try {
            //Is there a bearer token?
            if (bearerToken != null) {
                accessToken = await this.authService.loginUserViaToken(bearerToken);
            }
            //User is authenticating for the first time.
            else {
                let username: string = request.body.username;
                let password: string = request.body.password;

                if (username == null) {
                    response.status(HttpStatusCodes.BAD_REQUEST)
                        .json(new ServerErrorInfo(ServerErrorCode.MissingBodyParameter, 'Username is missing.'));
                    return;
                }
                else if (password == null) {
                    response.status(HttpStatusCodes.BAD_REQUEST)
                        .json(new ServerErrorInfo(ServerErrorCode.MissingBodyParameter, 'Password is missing.'));
                    return;
                }

                accessToken = await this.authService.loginUserViaCredentials(username, password);
            }

            //Send back the access token
            response.status(HttpStatusCodes.OK)
            .json(accessToken);
        }
        catch (error) {
            new ErrorHandler(error)
                .catch(AuthenticationError, (error: AuthenticationError) => {
                    response.status(HttpStatusCodes.UNAUTHORIZED)
                        .json(new ServerErrorInfo(ServerErrorCode.InvalidAuthentication, 'Invalid credentials'));
                })
                .otherwise((error: Error) => {
                    console.log('An error occured logging in a user: ', error);

                    response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                        .json(new ServerErrorInfo(ServerErrorCode.Unknown));
                });
        }
    }

    /**
     * Process a request to log out a user. This expects them to pass in
     * their JWT, or else it is rejected.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    @authenticate()
    public async logoutUser(request: Express.Request, response: Express.Response): Promise<void> {
        try {
            await this.authService.logoutUser(request.user);
            response.sendStatus(HttpStatusCodes.OK);
        }
        catch (error) {
            console.log('An error occured logging out a user: ', error);

            response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .json(new ServerErrorInfo(ServerErrorCode.Unknown));
        }
    }

    /**
     * Validate a user's login. This simply checks that a user is who they
     * claim to be.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    @body(ValidateLoginPayload)
    public async validateUserLogin(request: Express.Request, response: Express.Response): Promise<void> {
        try {
            let user: User = await this.userService.findByUsername(request.body.username);

            if(user == null){
                response.sendStatus(HttpStatusCodes.UNAUTHORIZED);
                return;
            }

            let isValid: boolean = await this.authService.validateLogin(user, request.body.loginCode);

            if(isValid) {
                response.status(HttpStatusCodes.OK)
                .json({userId: user.id })
            }
            else {
                response.sendStatus(HttpStatusCodes.UNAUTHORIZED);
            }
        }
        catch(error) {
            console.log('An error occured validating a user login: ', error);

            response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .json(new ServerErrorInfo(ServerErrorCode.Unknown));
        }
    }

}