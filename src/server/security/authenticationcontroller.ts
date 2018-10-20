import {Router, Request, Response, NextFunction } from 'express';
import { Server } from '../server';
import { BaseController } from '../common/baserouter';
import * as HttpStatus from 'http-status-codes';
import { UserLogin } from '../../data/models';
import { IServiceLocator } from '../../logic/common/iservicelocator';

/**
 * Handles login requests, along with middleware for
 * checking incoming requests for a json web token
 * attached to them.
 */
export class AuthenticationController extends BaseController {
    /**
     * Service for looking up users based off their id.
     */
    private userService: any;

    /**
     * The login service that connects back to
     * the database.
     */
    private authService: any;

    /**
     * Create a new instance of the authentication router.
     * @param serviceLocator The service locator for finding 
     * any needed services.
     */
    constructor(serviceLocator: IServiceLocator) {
        super();
        //this.userService = serviceLocator.userService;
        //this.authService = serviceLocator.authService;
    }

    /**
     * Process a request to login under the passed in credentials.
     * @param request The request making the login attempt.
     * @param response The response to send back to the caller.
     */
    public async loginUser(request: Request, response: Response):Promise<void> {
        if(!request.body){
            response.sendStatus(HttpStatus.BAD_REQUEST);
        }

        let username = request.body.username;
        let password = request.body.password;

        if(!username || !password) {
            response.sendStatus(HttpStatus.BAD_REQUEST);
        }

        try {
            let login: UserLogin = await this.authService.loginUser(username, password);

            if(login){
                response.send(login);
            }
            else {
                response.sendStatus(HttpStatus.UNAUTHORIZED);
            }
        }
        catch (error) {
            console.log('LoginRouter.loginUser(): ', error);
            response.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * 
     * @param request The request making the logout attempt.
     * @param response The response to send back to the caller.
     */
    public async logoutUser(request: Request, response: Response):Promise<void> {
        if(!request.body || !request.body.loginGuid){
            response.sendStatus(HttpStatus.BAD_REQUEST);
        }
        
        try {
            let username: string = request.body.username;
            let loginGuid:string = request.body.loginGuid;
            await this.authService.logoutUser(username, loginGuid);
            response.sendStatus(HttpStatus.OK);
        }
        catch(error){
            console.log('AuthenticationRouter.logoutUser(): ', error);
            response.sendStatus(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Checks incoming requests to see if the user has
     * a json web token in their request or not. If they
     * do we validate them pull in the user.
     * @param request The request to check for a bearer token
     * @param response The response being built for them.
     * @param next 
     */
    public async processRequestForLogin(request: Request, response: Response, next: NextFunction) {
        //Nothing to bother with, skip.
        if(!request.headers || !request.headers.authorization){
            next();
            return;
        }

        let token = request.headers.authorization.split(' ')[1];

        //Request had token, try to validate it
        if(token) {
            try {
                let user = await this.authService.validateToken(token);

                //We pop a user property onto the request.
                if(user != null){
                    request.user = user;
                }
            }
            catch(error){
                console.log('AuthenticationRouter.processRequestForLogin(): ', error);
            }
        }

        next();
    }

    /**
     * Initialize the router and any services needed.
     */
    protected init():void {
        this.loginUser.bind(this);

        this.router.post('/login', async (req, res) => this.loginUser(req, res));
    }
}