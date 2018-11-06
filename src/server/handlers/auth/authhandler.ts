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
import { PasswordUpdatePayload } from './payloads/passwordupdatepayload';
import { PasswordResetPayload } from './payloads/passwordresetpayload';
import { UserRegistration } from '../../../logic/common/userregistration';
import { EmailVerificationPayload } from './payloads/emailverificationpayload';
import { User } from '../../../logic/models/user';
import { ForgotUsernamePayload } from './payloads/forgotusernamepayload';
import { ForgotPasswordPayload } from './payloads/forgotpasswordpayload';
import { ValidateLoginPayload } from './payloads/validateloginpayload';
import { LoginCredentialsPayload } from './payloads/logincredentialspayload';
import { IUserService } from '../../../logic/contract/services/iuserservice';

/**
 * Router responsible for handling all incoming 
 * requests related to authentication, and more.
 */
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
    constructor(authService: IAuthService, userService: IUserService) {
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

        this.expressRouter.post('/username/', async (req, res) => { return this.forgotUsername(req, res); });
        this.expressRouter.post('/password/', async (req, res) => { return this.forgotPassword(req, res); });

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
            response.status(HttpStatusCodes.OK);
        }
        catch (error) {
            console.log('An error occured logging out a user: ', error);

            response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .json(new ServerErrorInfo(ServerErrorCode.Unknown));
        }
    }

    /**
     * Process a request to update a user's password. This checks for a 
     * bearer token, and their current password.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    @authenticate()
    @body(PasswordUpdatePayload)
    public async updatePassword(request: Express.Request, response: Express.Response): Promise<void> {
        try {
            await this.authService.updatePassword(request.user, request.body.currentPassword, request.body.newPassword);
            response.sendStatus(HttpStatusCodes.OK);
        }
        catch (error) {
            new ErrorHandler(error)
                .catch(AuthenticationError, (error: AuthenticationError) => {
                    response.status(HttpStatusCodes.UNAUTHORIZED)
                        .json(new ServerErrorInfo(ServerErrorCode.InvalidAuthentication));
                })
                .otherwise((error: Error) => {
                    console.log('An error occured updating a password: ', error);

                    response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                        .json(new ServerErrorInfo(ServerErrorCode.Unknown));
                });
        }
    }

    /**
     * Process a request to reset a user's password. This expects a bearer
     * token, their reset code, and a new password.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    @authenticate()
    @body(PasswordResetPayload)
    public async resetPassword(request: Express.Request, response: Express.Response): Promise<void> {
        try {
            await this.authService.resetPassword(request.user, request.body.resetCode, request.body.newPassword);
            response.status(HttpStatusCodes.OK);
        }
        catch (error) {
            new ErrorHandler(error)
                .catch(AuthenticationError, (error: AuthenticationError) => {
                    response.sendStatus(HttpStatusCodes.UNAUTHORIZED);
                })
                .otherwise((error: Error) => {
                    console.log('An error occcured reseting a password: ', error);

                    response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                        .json(new ServerErrorInfo(ServerErrorCode.Unknown));
                });
        }
    }


    /**
     * Verify a user's email. This will check their verification code
     * provided with the one they were emailed. This also expects a 
     * JWT.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    @authenticate()
    @body(EmailVerificationPayload)
    public async verifyEmail(request: Express.Request, response: Express.Response): Promise<void> {
        try {
            let success: boolean = await this.authService.verifyUserEmail(request.user, request.body.verificationCode);

            if (success) {
                response.sendStatus(HttpStatusCodes.OK);
            }
            else {
                response.sendStatus(HttpStatusCodes.BAD_REQUEST);
            }
        }
        catch (error) {
            console.log('An error occured registering a user: ', error);

            response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .json(new ServerErrorInfo(ServerErrorCode.Unknown));
        }
    }

    /**
     * Resend the user their verification email. This expects the user
     * to provide their JWT.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    @authenticate()
    public async resendVerificationEmail(request: Express.Request, response: Express.Response): Promise<void> {
        try {
            await this.authService.resendVerificationEmail(request.user);
            response.sendStatus(HttpStatusCodes.OK);
        }
        catch(error) {
            console.log('An error occured registering a user: ', error);

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

            if(user = null){
                response.sendStatus(HttpStatusCodes.UNAUTHORIZED);
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

    /**
     * User forgot their username, and wants it to be emailed to them.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    @body(ForgotUsernamePayload)
    public async forgotUsername(request: Express.Request, response: Express.Response): Promise<void> {
        try {
            await this.authService.emailUserTheirUsername(request.body.username);
        }
        catch(error) {
            console.log('An error occured requesting a forgotten username: ', error);

            response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .json(new ServerErrorInfo(ServerErrorCode.Unknown));
        }
    }

    /**
     * User forgot their password, and wants to reset it. This will email
     * them a reset verification code to use.
     * @param request The incoming request to process.
     * @param response The outgoing response being built.
     */
    @body(ForgotPasswordPayload)
    public async forgotPassword(request: Express.Request, response: Express.Response): Promise<void> {
        try {
            await this.authService.emailUserResetToken(request.body.username);
        }
        catch(error) {
            console.log('An error occured requesting a forgotten username: ', error);

            response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .json(new ServerErrorInfo(ServerErrorCode.Unknown));
        }
    }
}