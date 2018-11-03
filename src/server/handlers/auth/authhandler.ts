import * as Express from 'express';
import { IHandler } from "../../common/ihandler";
import { IAuthService } from "../../../logic/contract/services/iauthservice";
import { NotImplementedError } from '../../../common/error/types/notimplementederror';

/**
 * Router responsible for handling all incoming 
 * requests related to authentication, and more.
 */
export class AuthHandler implements IHandler {
    /**
     * The auth service from the BLL.
     */
    private authService: IAuthService;

    private expressRouter: Express.Router;

    /**
     * Create a new auth router.
     * @param authService The authservice to use.
     */
    constructor(authService: IAuthService) {
        this.authService = authService;
        this.expressRouter = Express.Router();
    }

    /**
     * Initialize the handler for use.
     * @param expressApp The express application to work with.
     */
    public initRoutes(expressApp: Express.Application): void {
        throw new NotImplementedError();
    }

    public loginUser(request: Express.Request, response: Express.Response): Promise<void> {
        throw new NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }

    public logoutUser(request: Express.Request, response: Express.Response): Promise<void> {
        throw new NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }

    public updatePassword(request: Express.Request, response: Express.Response): Promise<void> {
        throw new NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }

    public resetPassword(request: Express.Request, response: Express.Response): Promise<void> {
        throw new NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }

    public registerNewUser(request: Express.Request, response: Express.Response): Promise<void> {
        throw new NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }

    public verifyEmail(request: Express.Request, response: Express.Response): Promise<void> {
        throw new NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }

    public sendVerificationEmail(request: Express.Request, response: Express.Response): Promise<void> {
        throw new NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }

    public resendVerificationEmail(request: Express.Request, response: Express.Response): Promise<void> {
        throw new NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }

    public validateUserLogin(request: Express.Request, response: Express.Response): Promise<void> {
        throw new NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }

    public forgotUsername(request: Express.Request, response: Express.Response): Promise<void> {
        throw new NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }

    public forgotPassword(request: Express.Request, response: Express.Response): Promise<void> {
        throw new NotImplementedError();
        //Handles JWT first
        //Then checks body otherwise.
    }
}