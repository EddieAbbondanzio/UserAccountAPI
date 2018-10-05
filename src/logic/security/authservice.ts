import { Service } from "../common/service";
import { UserLogin, User, UserLoginRepository, UserRepository, UserRegistration, ValidationToken, ValidationTokenRepository } from "../../data/datamodule";
import { Connection } from "typeorm";
import { TokenManager } from "./tokenmanager";
import { TokenPayload } from "./tokenpayload";
import { IEmail } from "../email/types/iemail";
import { TextEmail } from "../email/types/textemail";
import { IEmailService } from "../email/iemailservice";


/**
 * The service used by the server to process login
 * requests, and check requests made for a login token.
 */
export class AuthService extends Service {
    /**
     * The repo that holds all of the users in the
     * database.
     */
    private userRepository: UserRepository;

    /**
     * The repo that holds all of the user logins
     * within the database.
     */
    private loginRepository: UserLoginRepository;

    /**
     * The service for sending emails.
     */
    private emailService: IEmailService;

    /**
     * Handles giving out and verifying Json Web Tokens.
     */
    private tokenManager: TokenManager;

    /**
     * Get a new LoginService up and running.
     * @param connection The underlying database connection.
     * @param emailService The service to send emails.
     * @param tokenKey The secret encryption key for JWTs.
     */
    constructor(connection: Connection, emailService: IEmailService, tokenKey: string) {
        super(connection);

        this.emailService    = emailService;
        this.tokenManager    = new TokenManager(tokenKey);
        this.userRepository  = connection.getCustomRepository(UserRepository);
        this.loginRepository = connection.getCustomRepository(UserLoginRepository);
    }

    /**
     * A new user wishes to join. Process their registration
     * and attempt to add them to the system.
     * @param registration The user's registration.
     * @returns The new user if success, or null.
     */
    public async registerNewUser(registration: UserRegistration): Promise<User|null> {
        if(!registration || !registration.validate()){
            return null;
        }

        try {
            let user: User = await User.fromRegistration(registration);
            var vToken: ValidationToken;

            await this.transaction(async manager => {
                //First insert the user
                let userRepo: UserRepository = manager.getCustomRepository(UserRepository);
                await userRepo.add(user);

                //Now generate a validation token.
                vToken = ValidationToken.generateToken(user);
                let tokenRepo: ValidationTokenRepository = manager.getCustomRepository(ValidationTokenRepository);
                await tokenRepo.add(vToken);

                //Generate a login for the user
                let login: UserLogin = UserLogin.generateLogin(user);
                login.token = await this.tokenManager.issueToken(user);

                let loginRepo: UserLoginRepository = manager.getCustomRepository(UserLoginRepository);
                await loginRepo.add(login);

                user.login = login;
            });

            //Send them a confirmation email
            let validationEmail: IEmail = new TextEmail(registration.email,
            "No Man's Blocks Account Confirmation.",
            "Thanks for joining! Your confirmation code is: " + vToken.code
            );

            await this.emailService.sendEmail(validationEmail);
            return user;
        }
        catch(error){
            console.log('Failed to register new user: ', error);
            return null;
        }
    }

    /**
     * Validate a user's email by checking the validation code they gave us.
     * @param user The user whos email we need to validate.
     * @param validationCode The validation code they provided.
     * @returns True if the code was valid.
     */
    public async validateUserEmail(user: User, validationCode: string): Promise<boolean> {
        return false;
    }

    public async resendValidationCode(user: User): Promise<boolean> {
        return false;
    }















    

    /**
     * Login a user via their credentials.
     * @param username The user's username.
     * @param password The user's password.
     * @returns The user if successful. Otherwise null.
     */
    public async loginUserViaCredentials(username: string, password: string): Promise<User|null> {
        return null;
    }

    /**
     * Login a user using a JWT they have.
     * @param token The JWT from a previous login.
     * @returns The user if successful. Otherwise null.
     */
    public async loginUserViaToken(token: string): Promise<User|null> {
        return null;
    }

    /**
     * Log out a user that is currently logged in.
     * @param username The username to log out.
     * @param loginGuid Their login guid to use.
     * @returns True if logged out.
     */
    public async logoutUser(username: string, loginGuid: string): Promise<boolean> {
        return false;
    }

    /**
     * Reset a user's password after verifying their token is valid.
     * @param username The username of the user.
     * @param passwordToken Their temporary access password.
     * @param newPassword Their new desired password.
     * @returns True if the token was valid.
     */
    public async resetPassword(username: string, passwordToken: string, newPassword: string): Promise<boolean> {
        return false;
    }

    /**
     * Update a user's password. This only proceeds if their current
     * password passed in is valid.
     * @param username The username of the user.
     * @param currPassword Their current password.
     * @param newPassword Their new desired password.
     * @returns True if successful.
     */
    public async updatePassword(username: string, currPassword: string, newPassword: string): Promise<boolean> {
        return false;
    }

    /**
     * Validate that a user is who they claim to be. This will check their username
     * against the login provided in the database.
     * @param username The username of the user.
     * @param loginGuid Their login guid.
     * @returns True if the user is who they claim to be.
     */
    public async validateUser(username: string, loginGuid: string): Promise<boolean> {
        return false;
    }
















    /**
     * Log in an existing user by checking the database for a match.
     * @param username The username to log in under.
     * @param password Their password to verify.
     * @returns The user login if successful.
     */
    public async loginUser(username: string, password: string): Promise<UserLogin|null> {
        let user: User = await this.userRepository.findByUsername(username);

        //If no user was found, fail the login
        if(user == null){
            return null;
        }

        //Now verify credentials.
        if(!await user.validatePassword(password)){
            return null;
        }

        //Build the new login, and save it so we
        //can get it's unique login id.
        let userLogin: UserLogin = UserLogin.generateLogin(user);
        await this.loginRepository.add(userLogin);

        return userLogin;
    }

    // /**
    //  * Log out an already logged in user. This will invalidate their
    //  * login
    //  * @param username The username of the user to log out.
    //  * @param guid The unique id of the login
    //  */
    // public async logoutUser(guid: string) {
    //     await this.loginRepository.deleteByGuid(guid);
    // }

    /**
     * Attempts to validate a loginId that a user passed to a game server. This
     * checkes if the login is actually valid and stored in the database.
     * @param username The username of the user who's login we need to validate.
     * @param guid The GUID of the login. This needs to be checked.
     * @returns True if the login is legitimate.
     */
    public async validateLogin(username: string, guid: string) : Promise<boolean> {
        try {
            let userLogin: UserLogin = null; //await this.loginRepository.findByGuid(guid);

            if(userLogin){
                return true;
            }
            else {
                return false;
            }
        }
        catch(error) {
            return false;
        }
    }

    /**
     * Refresh a user login and provide them with a new unique GUID. This 
     * will let them keep using their JWT since it has a log expiration
     * date.
     * @param loginToken: The JWT of the user.
     * @returns A user login if the request was authentic.
     */
    public async refreshLogin(loginToken: string) : Promise<UserLogin> {
        let payload: TokenPayload = await this.tokenManager.verifyToken(loginToken);

        if(payload){
            let user: User = await this.userRepository.findById(payload.userId);

            if(!user){
                throw new Error("Failed to find user");
            }

            let userLogin: UserLogin = UserLogin.generateLogin(user);
            await this.loginRepository.add(userLogin);
            return userLogin;
        }
        else {
            throw new Error("Invalid login token");
        }
    }

    /**
     * Validate the token and try to get the user from it.
     * @param loginToken The JWT to extract info from.
     */
    public async validateToken(loginToken: string) : Promise<User> {
        let payload: TokenPayload = await this.tokenManager.verifyToken(loginToken);

        if(payload){
            let user: User = await this.userRepository.findById(payload.userId);

            if(!user){
                throw new Error("Failed to find user");
            }

            return user;
        }
        else {
            throw new Error("Invalid login token");
        }
    }
}