import * as Express from 'express';
import * as HttpStatusCodes from 'http-status-codes';
import { IHandler } from "../../common/ihandler";
import { ForgotUsernamePayload } from "./payloads/forgotusernamepayload";
import { IUserService } from "../../../logic/contract/services/iuserservice";
import { ServerErrorCode } from "../../common/servererrorcode";
import { ServerErrorInfo } from "../../common/servererrorinfo";
import { ForgotPasswordPayload } from './payloads/forgotpasswordpayload';
import { body } from '../../common/decorators/body';
import { EmailVerificationPayload } from './payloads/emailverificationpayload';
import { PasswordResetPayload } from './payloads/passwordresetpayload';
import { PasswordUpdatePayload } from './payloads/passwordupdatepayload';
import { authenticate } from '../../common/decorators/authenticate';
import { ErrorHandler } from '../../../common/error/errorhandler';
import { AuthenticationError } from '../../../common/error/types/authenticationerror';
import { UserUpdate } from './payloads/userupdate';
import { IAccountService } from '../../../logic/contract/services/iaccountservice';
import { inject, injectable } from 'inversify';
import { IOC_TYPES } from '../../../common/ioc/ioctypes';

/**
 * Network handler for managing incoming requests related
 * to User accounts.
 */
@injectable()
export class AccountHandler implements IHandler {
    /**
     * The user service from the BLL.
     */
    public userService: IUserService;

    /**
     * The Account service.
     */
    private accountService: IAccountService;

    /**
     * Handles all of the network stuff...
     */
    private expressRouter: Express.Router;

    /**
     * Create a new AccountHandler. This manages all incoming
     * requests to update a user's account, and builds responses.
     * @param userService The service for working with users.
     * @param accountService The service for updating accounts. 
     */
    constructor(@inject(IOC_TYPES.AuthService) userService: IUserService, 
                @inject(IOC_TYPES.AccountService) accountService: IAccountService) {
        this.userService    = userService;
        this.accountService = accountService;

        this.expressRouter = Express.Router();
    }

    /**
     * Initialize all of the routes for use.
     * @param expressApp The running Express Application.
     */
    public initRoutes(expressApp: Express.Application): void {
        this.expressRouter.post('/forgotusername/', async (req, res) => { return this.forgotUsername(req, res); });
        this.expressRouter.post('/forgotpassword/', async (req, res) => { return this.forgotPassword(req, res); });

        this.expressRouter.post('/password/', async (req, res) => { return this.resetPassword(req, res); });
        this.expressRouter.put('/password/', async (req, res) => { return this.updatePassword(req, res); });

        this.expressRouter.put('/verifyemail/', async (req, res) => {return this.resendVerificationEmail(req, res); });
        this.expressRouter.post('/verifyemail/', async (req, res) => {return this.verifyEmail(req, res); });

        this.expressRouter.post('/', async (req, res) => { return this.updateInfo(req, res); });
        this.expressRouter.delete('/', async (req, res) => { return this.deleteAccount(req, res); });

        expressApp.use('/account/', this.expressRouter);
    }

    /**
     * Handle an incoming request to update a user.
     * @param request The incoming request to work with.
     * @param response The outgoing response being built.
     */
    @authenticate()
    @body(UserUpdate)
    public async updateInfo(request: Express.Request, response: Express.Response): Promise<void> {
        request.user.name = request.body.name;
        request.user.email = request.body.email;

        try {
            await this.accountService.updateInfo(request.user);
            response.sendStatus(HttpStatusCodes.OK);
        }
        catch (error) {
            console.log(error);
            response.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
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
            await this.accountService.emailUserTheirUsername(request.body.email);
            response.sendStatus(HttpStatusCodes.OK);
        }
        catch (error) {
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
            await this.accountService.emailUserResetToken(request.body.username);
            response.sendStatus(HttpStatusCodes.OK);
        }
        catch (error) {
            console.log('An error occured requesting a forgotten username: ', error);

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
            await this.accountService.updatePassword(request.user, request.body.currentPassword, request.body.newPassword);
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
            await this.accountService.resetPassword(request.user, request.body.resetCode, request.body.newPassword);
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
            let success: boolean = await this.accountService.verifyUserEmail(request.user, request.body.verificationCode);

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
            await this.accountService.resendVerificationEmail(request.user);
            response.sendStatus(HttpStatusCodes.OK);
        }
        catch (error) {
            console.log('An error occured registering a user: ', error);

            response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .json(new ServerErrorInfo(ServerErrorCode.Unknown));
        }
    }
    
    /**
     * Handle an incoming request to delete a user.
     * @param request The incoming request to work with.
     * @param response The outgoing response being built.
     */
    @authenticate()
    private async deleteAccount(request: Express.Request, response: Express.Response): Promise<void> {
        try {
            await this.userService.delete(request.user);
        }
        catch(error){
            console.log(error);
            response.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}