import { LogicHandler } from "../../common/logichandler";
import { Connection, EntityManager } from "typeorm";
import { IServiceLocator } from "../../common/iservicelocator";
import { UserRegistration, User, VerificationToken, UserRepository, VerificationTokenRepository, UserLogin, UserLoginRepository } from "../../../data/datamodule";
import { IEmailService } from "../../services/email/iemailservice";
import { TokenManager } from "../common/tokenmanager";
import { IEmail } from "../../services/email/types/iemail";
import { TextEmail } from "../../services/email/types/textemail";
import { StringUtils } from "../../../util/stringutils";
import { ValidatorResult } from "../../validation/validatorresult";
import { UserCreateValidator } from "../../validation/user/validators/usercreatevalidator";
import { ValidationError } from "../../validation/validationerror";

/**
 * Business logic for the registration portion of the 
 * authentication component.
 */
export class RegistrationHandler extends LogicHandler {
    /**
     * The service for sending out emails.
     */
    private emailService: IEmailService;

    /**
     * The JWT manager.
     */
    private tokenManager: TokenManager;

    /**
     * The validator to validate newly created users.
     */
    private userCreateValidator: UserCreateValidator;

    /**
     * Create a new registration logic.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator){
        super(connection, serviceLocator);

        this.emailService = serviceLocator.emailService;
        this.tokenManager = serviceLocator.tokenManager;
        this.userCreateValidator = new UserCreateValidator();
    }

    /**
     * Register a new user with the system. This will
     * send them a confirmation email before they are done.
     * @param registration The user's info.
     * @returns The new user, or null if it failed.
     */
    public async registerNewUser(registration: UserRegistration): Promise<User> {
        if(!registration){
            throw new Error('No registration passed in.');
        }

        let user: User = await User.fromRegistration(registration);
        let vToken: VerificationToken;

        //Is the user even valid?
        let validatorResult: ValidatorResult = this.userCreateValidator.validate(user);

        if(!validatorResult.isValid){
            throw new ValidationError('Failed to register new user.', validatorResult);
        }

        await this.transaction(async (manager: EntityManager): Promise<void> => {
            let userRepo: UserRepository = manager.getCustomRepository(UserRepository);
            await userRepo.add(user);

            //Now generate a validation token.
            vToken = new VerificationToken(user);
            let tokenRepo: VerificationTokenRepository = manager.getCustomRepository(VerificationTokenRepository);
            await tokenRepo.add(vToken);

            //Issue a login for the user
            let loginRepo: UserLoginRepository = manager.getCustomRepository(UserLoginRepository);
            let login: UserLogin = new UserLogin(user);
            login.token = await this.tokenManager.issueToken(user);
            await loginRepo.add(login);

            //Set their login, and get ready to return things.
            user.login = login;
        });

        //Send them the email
        await this.sendVerificationEmail(user, vToken);
        
        return user;
    }

    /**
     * Verify a user's email by checking the validation code they gave us.
     * @param user The user whos email we need to validate.
     * @param verificationCode The validation code they provided.
     * @returns True if the code was valid.
     */
    public async verifyUserEmail(user: User, verificationCode: string): Promise<boolean> {
        if(!user){
            throw new Error('No user passed in.');
        }

        //Is user already validated?
        if(user.isVerified){
            return true;
        }

        let vTokenRepo: VerificationTokenRepository = this.connection.getCustomRepository(VerificationTokenRepository);
        let vToken: VerificationToken = await vTokenRepo.findByUser(user);

        //Not found, or bad match
        if(!vToken || vToken.code !== verificationCode){
            return false;
        }
        else {
            user.isVerified = true;
        }
        
        await this.transaction(async (manager): Promise<void> => {
            let userRepo: UserRepository = manager.getCustomRepository(UserRepository);
            let tokenRepo: VerificationTokenRepository = manager.getCustomRepository(VerificationTokenRepository);

            await Promise.all([userRepo.update(user), tokenRepo.delete(vToken)]);
        });

        return true;
    }

    /**
     * The user didn't recieve their validation code. Resend them an
     * email with it again.
     * @param user The user to re email.
     * @returns True if no error.
     */
    public async resendVerificationEmail(user: User): Promise<boolean> {
        if(!user){
            throw new Error('No user passed in.');
        }

        //User has already been verified.
        if(user.isVerified){
            return true;
        }

        let vTokenRepo: VerificationTokenRepository = this.connection.getCustomRepository(VerificationTokenRepository);
        let vToken: VerificationToken = await vTokenRepo.findByUser(user);

        //Not found.
        if(!vToken){
            return false;
        }
        
        return this.sendVerificationEmail(user, vToken);
    }

    /**
     * Send the user their validation code via an email.
     * @param user The user to re email.
     * @param vToken Their validation code.
     */
    private async sendVerificationEmail(user: User, vToken: VerificationToken): Promise<boolean>{
        let validationEmail: IEmail = new TextEmail(user.email,
            "No Man's Blocks Account Confirmation.",
            "Thanks for joining! Your confirmation code is: " + vToken.code
        );

        return this.emailService.sendEmail(validationEmail);
    }
}