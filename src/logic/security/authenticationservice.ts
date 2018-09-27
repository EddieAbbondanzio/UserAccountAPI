import { Service } from "../common/service";
import { UserLogin, User, UserLoginRepository, UserRepository, UserRegistration } from "../../data/datamodule";
import { Request, Response, NextFunction } from "express";
import { Connection, IsNull } from "typeorm";
import { PasswordHasher } from "./passwordhasher";
import { TokenManager } from "./tokenmanager";
import { TokenPayload } from "./tokenpayload";


/**
 * The service used by the server to process login
 * requests, and check requests made for a login token.
 */
export class AuthenticationService extends Service {
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
     * The hash generator, and checker of passwords.
     */
    private passwordHasher: PasswordHasher;

    /**
     * Handles giving out and verifying Json Web Tokens.
     */
    private tokenManager: TokenManager;

    /**
     * Get a new LoginService up and running.
     * @param connection The underlying database connection.
     */
    constructor(connection: Connection) {
        super(connection);

        this.passwordHasher = new PasswordHasher();
        this.tokenManager = new TokenManager();
        this.userRepository = connection.getCustomRepository(UserRepository);
        this.loginRepository = connection.getCustomRepository(UserLoginRepository);
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
        let userLogin: UserLogin = UserLogin.GenerateLogin(user);
        await this.loginRepository.add(userLogin);

        return userLogin;
    }

    /**
     * Log out an already logged in user. This will invalidate their
     * login
     * @param username The username of the user to log out.
     * @param guid The unique id of the login
     */
    public async logoutUser(guid: string) {
        await this.loginRepository.deleteByGuid(guid);
    }

    /**
     * Attempts to validate a loginId that a user passed to a game server. This
     * checkes if the login is actually valid and stored in the database.
     * @param username The username of the user who's login we need to validate.
     * @param guid The GUID of the login. This needs to be checked.
     * @returns True if the login is legitimate.
     */
    public async validateLogin(username: string, guid: string) : Promise<boolean> {
        try {
            let userLogin: UserLogin = await this.loginRepository.findByGuid(guid);

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

            let userLogin: UserLogin = UserLogin.GenerateLogin(user);
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