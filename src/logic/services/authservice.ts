import { TokenManager } from "../helpers/tokenmanager";
import { User } from "../models/user";
import { StringUtils } from "../../util/stringutils";
import { AuthenticationError } from "../common/authenticationerror";
import { UserLogin } from "../models/userlogin";
import { TokenPayload } from "../common/tokenpayload";
import { ResetToken } from "../models/resettoken";
import { VerificationToken } from "../models/verificationtoken";
import { IEmail } from "../email/types/iemail";
import { TextEmail } from "../email/types/textemail";
import { Service } from "../common/service";
import { IDatabase } from "../common/idatabase";
import { UserRegistration } from "../common/userregistration";
import { ValidatorResult } from "../validation/validatorresult";
import { UserCreateValidator } from "../validation/user/validators/usercreatevalidator";
import { ValidationError } from "../validation/validationerror";
import { ServiceType } from "../common/servicetype";
import { IAuthService } from "./iauthservice";
import { IEmailSender } from "../email/iemailsender";

/**
 * The authentication service of the system. This handles registering,
 * logging in, or updating user's passwords.
 */
export class AuthService extends Service implements IAuthService {
    /**
     * The type of service it is.
     */
    readonly serviceType: ServiceType = ServiceType.Auth;

   /**
     * The JWT manager.
     */ 
    private tokenManager: TokenManager;

    /**
     * The service for sending emails.
     */
    private emailSender: IEmailSender;

    /**
     * The validator to validate users being created.
     */
    private userCreateValidator: UserCreateValidator;

    /**
     * Create a new authentication service.
     * @param database The current database.
     * @param tokenManager The JWT manager.
     * @param emailSender The email sender service.
     */
    constructor(database: IDatabase, tokenManager: TokenManager, emailSender: IEmailSender) {
        super(database);

        this.tokenManager = tokenManager;
        this.emailSender  = emailSender;

        this.userCreateValidator = new UserCreateValidator();
    }

    /**
     * Login a user via their credentials.
     * @param username The user's username.
     * @param password The user's password.
     * @returns The user if successful. Otherwise null.
     */
    public async loginUserViaCredentials(username: string, password: string): Promise<User> {
        if(StringUtils.isEmpty(username) || StringUtils.isEmpty(password)){
            throw new Error('No username or password passed in!');
        }

        let user = await this.database.userRepo.findByUsername(username);

        if(!user){
            return null;
        }

        //Are they authentic?
        if(!(await user.validatePassword(password))){
            throw new AuthenticationError('User is not authorized.');
        }

        //Issue them a login
        let login: UserLogin = new UserLogin(user);
        login.token = await this.tokenManager.issueToken(user);

        //Save it
        await this.database.loginRepo.add(login);
        user.login = login;

        return user;
    }

    /**
     * Login a user using a JWT they have.
     * @param token The JWT from a previous login.
     * @returns The user if successful. Otherwise null.
     */
    public async loginUserViaToken(token: string): Promise<User> {
        let payLoad: TokenPayload = await this.tokenManager.verifyToken(token);
        let user: User = await this.database.userRepo.findById(payLoad.userId);

        //Issue them a login
        let login: UserLogin = new UserLogin(user);
        login.token = await this.tokenManager.issueToken(user);

        //Save it
        await this.database.loginRepo.add(login);
        user.login = login;

        return user;
    }

    /**
     * Log out a user that is currently logged in.
     * @param user The username to log out.
     * @returns True if logged out.
     */
    public async logoutUser(user: User): Promise<boolean> {
        if(!user.login){
            throw new Error('User is not logged in!');
        }

        //Delete it from the db
        let success = await this.database.loginRepo.delete(user.login);
        user.login = null;

        return success;
    }

    /**
     * Reset a user's password after verifying their token is valid.
     * @param user The user.
     * @param resetCode Their temporary access password.
     * @param newPassword Their new desired password.
     * @returns True if the token was valid.
     */
    public async resetPassword(user: User, resetCode: string, newPassword: string): Promise<boolean> {
        if(!user){
            throw new Error('No user passed in');
        }

        //Need to pull in the reset token for them.
        let resetToken: ResetToken = await this.database.resetTokenRepo.findByUser(user);

        if(resetToken && resetToken.code == resetCode){
            await user.setPassword(newPassword);

            await this.database.startTransaction();
            await Promise.all([this.database.resetTokenRepo.delete(resetToken),
                this.database.userRepo.updatePassword(user)]);
            await this.database.commitTransaction();

            return true;
        }

        return false;
    }

    /**
     * Update a user's password. This only proceeds if their current
     * password passed in is valid.
     * @param user The user to update.
     * @param currPassword Their current password.
     * @param newPassword Their new desired password.
     * @returns True if successful.
     */
    public async updatePassword(user: User, currPassword: string, newPassword: string): Promise<boolean> {
        if(!user){
            throw new Error('No user passed in.');
        }

        if(!(await user.validatePassword(currPassword))){
            throw new AuthenticationError('Invalid password.');
        }

        //Gotta update the password before we can update the user in the db.
        await user.setPassword(newPassword);
        await this.database.userRepo.updatePassword(user);

        return false;
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

        await this.database.startTransaction();

        await this.database.userRepo.add(user);

        //Now generate a validation token.
        vToken = new VerificationToken(user);
        await this.database.verificationTokenRepo.add(vToken);

        //Create their login
        let login: UserLogin = new UserLogin(user);
        login.token = await this.tokenManager.issueToken(user);
        await this.database.loginRepo.add(login);
        user.login = login;

        await this.database.commitTransaction();

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

        let vToken: VerificationToken = await this.database.verificationTokenRepo.findByUser(user);

        //Not found, or bad match
        if(!vToken || vToken.code !== verificationCode){
            return false;
        }
        else {
            user.isVerified = true;
        }
        
        await this.database.startTransaction();

        await Promise.all([this.database.userRepo.update(user), 
            this.database.verificationTokenRepo.delete(vToken)]);

        await this.database.commitTransaction();

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

        let vToken: VerificationToken = await this.database.verificationTokenRepo.findByUser(user);

        //Not found.
        if(!vToken){
            return false;
        }
        
        return this.sendVerificationEmail(user, vToken);
    }
    
    /**
     * Validate that a user is who they claim to be. This will check their username
     * against the login provided in the database.
     * @param user The user to validate.
     * @param loginCode Their login guid.
     * @returns True if the user is who they claim to be.
     */
    public async validateUser(user: User, loginCode: string): Promise<boolean> {
        if(!user){
            throw new Error('No user passed in');
        }

        //Try to find the login.
        let userLogin: UserLogin = await this.database.loginRepo.findByUser(user);

        if(userLogin && userLogin.code == loginCode){
            return true;
        }
        else {
            return false;
        }
    }

    
    /**
     * User forgot their username and wants it emailed to them.
     * @param email The user's email to send it to.
     */
    public async emailUserTheirUsername(email: string): Promise<void> {
        let user: User = await this.database.userRepo.findByEmail(email);

        //Only proceed if a user was found.
        if(user){
            let resetEmail: TextEmail = new TextEmail(user.email, 
                'No Mans Blocks Username',
                'Hi, your username is: ' + user.username    
            );

            await this.emailSender.sendEmail(resetEmail);
        }
    }

    /**
     * User forgot their email and wants a temporary access password
     * emailed to them. This will not remove their existing password.
     * @param username The username of the user to email.
     */
    public async emailUserResetToken(username: string): Promise<void> {
        let user: User = await this.database.userRepo.findByUsername(username);

        //Only send an email if a user was found.
        if(user){
            //Generate them a reset token.
            let rToken: ResetToken = new ResetToken(user);
            await this.database.resetTokenRepo.add(rToken);

            let resetEmail: TextEmail = new TextEmail(user.email,
                'No Mans Blocks Password Reset',
                'Hi, your password reset code is: ' + rToken.code
            );

            await this.emailSender.sendEmail(resetEmail);
        }
    }

    
    /**
     * Send the user their validation code via an email.
     * @param user The user to re email.
     * @param vToken Their validation code.
     */
    private async sendVerificationEmail(user: User, vToken: VerificationToken): Promise<boolean> {
        let validationEmail: IEmail = new TextEmail(user.email,
            "No Man's Blocks Account Confirmation.",
            "Thanks for joining! Your confirmation code is: " + vToken.code
        );

        return this.emailSender.sendEmail(validationEmail);
    }
}