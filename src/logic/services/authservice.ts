import { User } from "../models/user";
import { AuthenticationError } from "../../common/error/types/authenticationerror";
import { UserLogin } from "../models/userlogin";
import { Database } from "../common/database";
import { ServiceType } from "../common/servicetype";
import { IEmailSender } from "../email/iemailsender";
import { DatabaseService } from "../common/databaseservice";
import { NullArgumentError } from "../../common/error/types/nullargumenterror";
import { AccessToken } from "../common/accesstoken";
import { IAccessTokenService } from "../contract/services/iaccesstokenservice";
import { injectable, inject } from 'inversify';
import { IOC_TYPES } from "../../common/ioc/ioctypes";

/**
 * The authentication service of the system. This handles registering,
 * logging in, or updating user's passwords.
 */
@injectable()
export class AuthService extends DatabaseService {
    /**
     * The type of service it is.
     */
    readonly serviceType: ServiceType = ServiceType.Auth;

    /**
      * The JWT issuer, and authenticater.
      */
    private tokenService: IAccessTokenService;

    /**
     * Create a new authentication service.
     * @param database The current database.
     * @param tokenService The JWT manager.
     * @param emailSender The email sender service.
     */
    constructor(@inject(IOC_TYPES.Database) database: Database, 
                @inject(IOC_TYPES.TokenService) tokenService: IAccessTokenService, 
                @inject(IOC_TYPES.EmailSender) emailSender: IEmailSender) {
        super(database);

        this.tokenService = tokenService;
    }

    /**
     * Login a user via their credentials.
     * @param username The user's username.
     * @param password The user's password.
     * @returns An access token if successful.
     */
    public async loginUserViaCredentials(username: string, password: string): Promise<AccessToken> {
        //Check for good inputs.
        if (username == null) {
            throw new NullArgumentError('username');
        }
        else if (password == null) {
            throw new NullArgumentError('password');
        }

        //Pull in the user from the database.
        let user = await this.database.userRepo.findByUsername(username);

        //If no user found, or bad password crash and burn.
        if (user == null || !(await user.validatePassword(password))) {
            throw new AuthenticationError('Failed login attempt');
        }

        return this.loginUser(user);
    }

    /**
     * Relogin a user using the access token they provided. This
     * will invalidate their current token and give them a new one.
     * @param bearerToken The current bearer token.
     * @returns A refreshed access token if successful.
     */
    public async loginUserViaToken(bearerToken: string): Promise<AccessToken> {
        if (bearerToken == null) {
            throw new NullArgumentError('bearerToken');
        }

        //Authenticate the token, then pull in the user.
        let accessToken: AccessToken = await this.tokenService.authenticateToken(bearerToken);
        let user: User = await this.database.userRepo.findById(accessToken.userId);

        return this.loginUser(user);
    }

    /**
     * Log in a user.
     * @param user The user to log in.
     * @returns Their access token.
     */
    public async loginUser(user: User): Promise<AccessToken> {
        if (user == null) {
            throw new NullArgumentError('user');
        }

        try {
            await this.database.startTransaction();

            //Delete out any old ones
            await this.database.loginRepo.deleteForUser(user);

            //Issue them a login, and save it.
            let login: UserLogin = new UserLogin(user);
            await this.database.loginRepo.add(login);

            await this.database.commitTransaction();

            //Return a JWT for them
            return this.tokenService.issueToken(login);
        }
        catch (error) {
            if (this.database.isInTransaction()) {
                await this.database.rollbackTransaction();
            }

            throw error;
        }
    }

    /**
     * Log out a user by invalidating their JWT.
     * @param user The user to log out.
     */
    public async logoutUser(user: User): Promise<void> {
        if (user == null) {
            throw new NullArgumentError('user');
        }

        await this.database.loginRepo.deleteForUser(user);
    }

    /**
     * Validate that a user is who they claim to be. This will check their username
     * against the login provided in the database.
     * @param user The user to validate.
     * @param loginCode Their login guid.
     */
    public async validateLogin(user: User, loginCode: string): Promise<boolean> {
        if (user == null) {
            throw new NullArgumentError('user');
        }

        //Try to find the login.
        let userLogin: UserLogin = await this.database.loginRepo.findByUser(user);

        //Did we find one, and is the code accurate?
        return userLogin != null && userLogin.code == loginCode;
    }

}