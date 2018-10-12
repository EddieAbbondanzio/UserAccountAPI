import { LogicHandler } from "../../common/logichandler";
import { Connection } from "typeorm";
import { IServiceLocator } from "../../common/iservicelocator";
import { UserRegistration, User, VerificationToken, UserRepository, VerificationTokenRepository, UserLogin, UserLoginRepository } from "../../../data/datamodule";
import { IEmailService } from "../../services/email/iemailservice";
import { TokenManager } from "../common/tokenmanager";
import { IEmail } from "../../services/email/types/iemail";
import { TextEmail } from "../../services/email/types/textemail";
import { StringUtils } from "../../../util/stringutils";

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
     * Create a new registration logic.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator){
        super(connection, serviceLocator);

        this.emailService = serviceLocator.emailService;
        this.tokenManager = serviceLocator.tokenManager;
    }

    /**
     * Register a new user with the system. This will
     * send them a confirmation email before they are done.
     * @param registration The user's info.
     * @returns The new user, or null if it failed.
     */
    public async registerNewUser(registration: UserRegistration): Promise<User|null> {
        // if(!registration || !registration.validate()){
        //     return null;
        // }

        try {
            let user: User = await User.fromRegistration(registration);
            var vToken: VerificationToken;

            await this.transaction(async manager => {
                //First insert the user
                let userRepo: UserRepository = manager.getCustomRepository(UserRepository);
                await userRepo.add(user);

                //Now generate a validation token.
                vToken = VerificationToken.generateToken(user);
                let tokenRepo: VerificationTokenRepository = manager.getCustomRepository(VerificationTokenRepository);
                await tokenRepo.add(vToken);

                //Issue a login for the user
                let loginRepo: UserLoginRepository = manager.getCustomRepository(UserLoginRepository);
                let login: UserLogin = UserLogin.generateLogin(user);
                login.token = await this.tokenManager.issueToken(user);
                await loginRepo.add(login);

                //Set their login, and get ready to return things.
                user.login = login;
            });

            await this.sendValiditionEmail(user, vToken);
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
        if(!vToken || vToken.code === validationCode){
            return false;
        }
        else {
            user.isVerified = true;
        }
        
        this.transaction(async manager => {
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
    public async resendValidationCode(user: User): Promise<boolean> {
        if(!user || user.isVerified){
            return false;
        }

        let vTokenRepo: VerificationTokenRepository = this.connection.getCustomRepository(VerificationTokenRepository);
        let vToken: VerificationToken = await vTokenRepo.findByUser(user);

        //Not found.
        if(!vToken){
            return false;
        }
        else {
            await this.sendValiditionEmail(user, vToken);
            return true;
        }
    }

    /**
     * Send the user their validation code via an email.
     * @param user The user to re email.
     * @param vToken Their validation code.
     */
    private async sendValiditionEmail(user: User, vToken: VerificationToken): Promise<void>{
        let validationEmail: IEmail = new TextEmail(user.email,
            "No Man's Blocks Account Confirmation.",
            "Thanks for joining! Your confirmation code is: " + vToken.code
        );

        await this.emailService.sendEmail(validationEmail);
    }
}