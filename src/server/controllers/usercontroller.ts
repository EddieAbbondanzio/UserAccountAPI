import { BaseController } from "../common/baserouter";
import { IServiceLocator } from "../../logic/common/iservicelocator";
import { Request, Response } from "express";
import * as HttpStatus from 'http-status-codes';
import { UserRegistration } from "../../data/datamodule";

/**
 * Controller for handling user related requests. This
 * offers functionality such as registering, retrieving
 * a lost username, or resetting a password.
 */
export class UserController extends BaseController {
    /**
     * The underlying user service. This is the business
     * logic behind the server.
     */
    private userService: any;

    /**
     * Create a new instance of the user controller.
     * @param serviceLocator The service locator for
     * dependency inversion.
     */
    constructor(serviceLocator: IServiceLocator) {
        super();

       // this.userService = serviceLocator.userService;
    }

    /**
     * Register a new user with the system. This will return status 201
     * if completed with no error.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    public async registerUser(request: Request, response: Response):Promise<void> {
        let userReg: UserRegistration = new UserRegistration();
        userReg.username = request.body.username;
        userReg.password = request.body.password;
        userReg.email    = request.body.email;
        userReg.name     = request.body.name;

        if(await this.userService.register(userReg)){
            response.sendStatus(HttpStatus.CREATED);
        }
        else {
            response.sendStatus(HttpStatus.CONFLICT);
        }
    }

    /**
     * User forgot their username. Send them an email with it.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    public async forgotUsername(request: Request, response: Response):Promise<void> {
        throw new Error("Not implemented");
    }

    /**
     * User forgot their password. Send them an email with a code
     * that can be used to reset it.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    public async forgotPassword(request: Request, response: Response):Promise<void> {
        throw new Error("Not implemented");
    }

    /**
     * Is the username passed in available? Returns 200 OK if it is.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    public async isUsernameAvailable(request: Request, response: Response):Promise<void> {
        if(request.params){
            let username: string = request.params.username;

            if(username && await this.userService.isUsernameAvailable(username)){
                response.sendStatus(HttpStatus.OK);
            }
        }

        response.sendStatus(HttpStatus.NOT_FOUND);
    }

    /**
     * Initialize the router and any services that it
     * may need.
     */
    protected init():void {
        this.router.post('/login', this.registerUser);
        this.router.post('/forgotusername', this.forgotUsername);
        this.router.post('/forgotpassword', this.forgotUsername);
        this.router.get('/isusernameavailable/:username', this.isUsernameAvailable);
    }
}