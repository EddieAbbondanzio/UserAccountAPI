import { IUserService } from "../../logic/services/iuserservice";
import * as Express from 'express';
import * as HTTPStatusCodes from 'http-status-codes';
import { IHandler } from "../common/ihandler";
import { StringUtils } from "../../util/stringutils";
import { User } from "../../logic/models/user";
import { UserUsernameValidatorRule } from "../../logic/validation/user/rules/userusernamevalidatorrule";
import { ErrorHandler } from "../../common/error/errorhandler";
import { ValidationError } from "../../logic/validation/validationerror";
import { ArgumentError } from "../../common/error/types/argumenterror";
import { ErrorInfo } from "../../common/error/errorinfo";
import * as ExpressJWT from 'express-jwt';
import { Config } from "../../config/config";
import { authenticated } from "../common/authenticated";

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
        //Request to delete a user.
        this.expressRouter.post(
            '/:id',
            ExpressJWT({ secret: Config.current.tokenSignature }),
            async (req, res) => { return this.deleteUser(req, res); });

        //Request to update a user
        this.expressRouter.post(
            '/:id',
            ExpressJWT({ secret: Config.current.tokenSignature }),
            async (req, res) => { return this.updateUser(req, res); });

        //Request to check for an available username.
        this.expressRouter.head('/:username', async(req, res) => { return this.isUsernameAvailable(req, res); });

        //Request to find a user by id / email / or username.
        this.expressRouter.get('/:identifier', async (req, res) => { return this.findUser(req, res); });

        expressApp.use('/users/', this.expressRouter);
    }

    /**
     * Handle an incoming request to update a user.
     * @param request The incoming request to work with.
     * @param response The outgoing response being built.
     */
    private async updateUser(request: Express.Request, response: Express.Response): Promise<void> { 
        //TODO: Add JWT support.
        let id: number = request.params.id;

        if(isNaN(id)){
            response.sendStatus(HTTPStatusCodes.BAD_REQUEST);
        }
        else {
            //Pulls id in from the JWT
            //Then finds the user based off that.

            let name: string = request.body.name;
            let email: string = request.body.email;

        }
    }

    /**
     * Handle an incoming request to delete a user.
     * @param request The incoming request to work with.
     * @param response The outgoing response being built.
     */
    private async deleteUser(request: Express.Request, response: Express.Response): Promise<void> {
        //TODO: Add JWT support.

        //Pulls in the id from the JWT
        //Then finds user based off that.

    }

    /**
     * Process an incoming request to see if a useranme is available
     * via a HEAD request.
     * @param req The incoming request to work with.
     * @param response The outgoing response being built.
     */
    @authenticated
    private async isUsernameAvailable(request: Express.Request, response: Express.Response): Promise<void> {
        let username: string = request.params.username;

        if(StringUtils.isBlank(username)){
            response.sendStatus(HTTPStatusCodes.BAD_REQUEST);
            return;
        }

        try {
            let isAvail: boolean = await this.userService.isUsernameAvailable(username);
            response.sendStatus(isAvail ? HTTPStatusCodes.NOT_FOUND : HTTPStatusCodes.CONFLICT);
        }
        catch(error){
            new ErrorHandler(error)
            .catch(ArgumentError, (aError: ArgumentError) => {
                response.sendStatus(HTTPStatusCodes.BAD_REQUEST);
            })
            .catch(ValidationError, (vError: ValidationError) => {
                response.sendStatus(HTTPStatusCodes.NOT_ACCEPTABLE);
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

        if(StringUtils.isBlank(identifier)){
            response.sendStatus(HTTPStatusCodes.BAD_REQUEST);
            return;
        }

        try {
            //Is it a user id?
            if(StringUtils.isNumeric(identifier)){
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
        catch(error) {
            new ErrorHandler(error)
            .catch(ArgumentError, (aError: ArgumentError) => {
                response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
                .send(new ErrorInfo(1, aError.message));
            })
            .otherwiseRaise();
        }
    }
}
