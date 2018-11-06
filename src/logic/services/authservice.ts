import { User } from "../models/user";
import { StringUtils } from "../../util/stringutils";
import { AuthenticationError } from "../../common/error/types/authenticationerror";
import { UserLogin } from "../models/userlogin";
import { ResetToken } from "../models/resettoken";
import { VerificationToken } from "../models/verificationtoken";
import { IEmail } from "../email/types/iemail";
import { TextEmail } from "../email/types/textemail";
import { Database } from "../common/database";
import { UserRegistration } from "../common/userregistration";
import { ValidatorResult } from "../validation/validatorresult";
import { UserRegistrationValidator } from "../validation/user/validators/userregistrationvalidator";
import { ValidationError } from "../validation/validationerror";
import { ServiceType } from "../common/servicetype";
import { IEmailSender } from "../email/iemailsender";
import { DatabaseService } from "../common/databaseservice";
import { AccessTokenService } from "./tokenservice";
import { NullArgumentError } from "../../common/error/types/nullargumenterror";
import { AccessToken } from "../common/accesstoken";
import { IAccessTokenService } from "../contract/services/iaccesstokenservice";
import { ErrorHandler } from "../../common/error/errorhandler";
import { InvalidOperationError } from "../../common/error/types/invalidoperation";
import { ValidatorRuleResult } from "../validation/validatorruleresult";
import { PasswordValidatorRule } from "../validation/user/rules/passwordvalidatorrule";

/**
 * The authentication service of the system. This handles registering,
 * logging in, or updating user's passwords.
 */
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
     * The service for sending emails.
     */
    private emailSender: IEmailSender;

    /**
     * The validator to validate users being created.
     */
    private userRegistrationValidator: UserRegistrationValidator;

    /**
     * Create a new authentication service.
     * @param database The current database.
     * @param tokenService The JWT manager.
     * @param emailSender The email sender service.
     */
    constructor(database: Database, tokenService: IAccessTokenService, emailSender: IEmailSender) {
        super(database);

        this.tokenService = tokenService;
        this.emailSender = emailSender;

        this.userRegistrationValidator = new UserRegistrationValidator();
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
     * Reset a user's password after verifying their token is valid.
     * @param user The user.
     * @param resetCode Their temporary access password.
     * @param newPassword Their new desired password.
     */
    public async resetPassword(user: User, resetCode: string, newPassword: string): Promise<void> {
        if (user == null) {
            throw new NullArgumentError('user');
        }
        else if (resetCode == null) {
            throw new NullArgumentError('resetCode');
        }
        else if (newPassword == null) {
            throw new NullArgumentError('newPassword');
        }

        try {
            //Need to pull in the reset token for them.
            let resetToken: ResetToken = await this.database.resetTokenRepo.findByUser(user);

            if (resetToken && resetToken.code == resetCode) {
                await user.setPassword(newPassword);

                await this.database.startTransaction();
                await Promise.all([
                    this.database.resetTokenRepo.delete(resetToken),
                    this.database.userRepo.updatePassword(user),
                    this.database.loginRepo.deleteForUser(user)
                ]);

                await this.database.commitTransaction();
            }
            else {
                throw new AuthenticationError('Incorrect code');
            }
        }
        catch (error) {
            if (this.database.isInTransaction()) {
                await this.database.rollbackTransaction();
            }

            throw error;
        }
    }

    /**
     * Update a user's password. This only proceeds if their current
     * password passed in is valid.
     * @param user The user to update.
     * @param currPassword Their current password.
     * @param newPassword Their new desired password.
     */
    public async updatePassword(user: User, currPassword: string, newPassword: string): Promise<void> {
        if (user == null) {
            throw new NullArgumentError('user');
        }
        else if (currPassword == null) {
            throw new NullArgumentError('currPassword');
        }
        else if (newPassword == null) {
            throw new NullArgumentError('newPassword');
        }

        //Check the password they passed in first.
        if (!(await user.validatePassword(currPassword))) {
            throw new AuthenticationError('Invalid password.');
        }

        await user.setPassword(newPassword);

        try {
            await this.database.startTransaction();

            //Update their password, then remove any logins.
            await Promise.all([
                this.database.userRepo.updatePassword(user),
                this.database.loginRepo.deleteForUser(user)
            ]);

            await this.database.commitTransaction();
        }
        catch (error) {
            if (this.database.isInTransaction()) {
                await this.database.rollbackTransaction();
            }

            throw error;
        }
    }

    /**
     * Register a new user with the system. This will
     * send them a confirmation email before they are done.
     * @param registration The user's info.
     * @returns The new user, or null if it failed.
     */
    public async registerNewUser(registration: UserRegistration): Promise<User> {
        if (registration == null) {
            throw new NullArgumentError('registration');
        }

        //Is the user even valid?
        let validatorResult: ValidatorResult = this.userRegistrationValidator.validate(registration);

        if (!validatorResult.isValid) {
            throw new ValidationError('Failed to register new user.', validatorResult);
        }

        //Generate the user
        let user: User = await User.fromRegistration(registration);
        let vToken: VerificationToken;

        try {
            await this.database.startTransaction();

            await this.database.userRepo.add(user);

            //Now generate a validation token.
            vToken = new VerificationToken(user);
            await this.database.verificationTokenRepo.add(vToken);

            await this.database.commitTransaction();

            //Send them the email
            await this.sendVerificationEmail(user, vToken);
            return user;
        }
        catch (error) {
            if (this.database.isInTransaction()) {
                await this.database.rollbackTransaction();
            }

            throw error;
        }
    }

    /**
     * Verify a user's email by checking the validation code they gave us.
     * @param user The user whos email we need to validate.
     * @param verificationCode The validation code they provided.
     * @returns True if the code was valid.
     */
    public async verifyUserEmail(user: User, verificationCode: string): Promise<boolean> {
        //Check for good input.
        if (user == null) {
            throw new NullArgumentError('user');
        }
        else if (verificationCode == null) {
            throw new NullArgumentError('verifcationCode');
        }

        //Is user already validated?
        if (user.isVerified) {
            return true;
        }

        let vToken: VerificationToken = await this.database.verificationTokenRepo.findByUser(user);

        //Not found, or bad match
        if (vToken == null || vToken.code != verificationCode) {
            return false;
        }
        else {
            user.isVerified = true;
        }

        try {
            await this.database.startTransaction();

            await Promise.all([
                this.database.userRepo.update(user),
                this.database.verificationTokenRepo.delete(vToken)]
            );

            await this.database.commitTransaction();
            return true;
        }
        catch (error) {
            if (this.database.isInTransaction()) {
                await this.database.rollbackTransaction();
            }

            throw error;
        }
    }

    /**
     * The user didn't recieve their validation code. Resend them an
     * email with it again.
     * @param user The user to re email.
     */
    public async resendVerificationEmail(user: User): Promise<void> {
        if (user == null) {
            throw new NullArgumentError('user');
        }

        //User has already been verified.
        if (user.isVerified) {
            return;
        }

        let vToken: VerificationToken = await this.database.verificationTokenRepo.findByUser(user);

        //What are we trying to achieve here? No token...
        if (vToken == null) {
            return;
        }

        await this.sendVerificationEmail(user, vToken);
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

    /**
     * User forgot their username and wants it emailed to them.
     * @param email The user's email to send it to.
     */
    public async emailUserTheirUsername(email: string): Promise<void> {
        if (email == null) {
            throw new NullArgumentError('email');
        }

        let user: User = await this.database.userRepo.findByEmail(email);

        //Only proceed if a user was found.
        if (user) {
            let resetEmail: TextEmail = new TextEmail(user.email,
                'Forgotten Username',
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
        if (username == null) {
            throw new NullArgumentError('username');
        }

        let user: User = await this.database.userRepo.findByUsername(username);

        //Only send an email if a user was found.
        if (user) {
            try {
                await this.database.startTransaction();

                //Delete out old ones.
                await this.database.resetTokenRepo.deleteForUser(user);

                //Generate them a reset token.
                let rToken: ResetToken = new ResetToken(user);
                await this.database.resetTokenRepo.add(rToken);

                await this.database.commitTransaction();

                let resetEmail: TextEmail = new TextEmail(user.email,
                    'Password Reset',
                    'Hi, your password reset code is: ' + rToken.code
                );

                await this.emailSender.sendEmail(resetEmail);
            }
            catch (error) {
                if (this.database.isInTransaction()) {
                    await this.database.rollbackTransaction();
                }

                throw error;
            }
        }
    }

    /**
     * Send the user their validation code via an email.
     * @param user The user to re email.
     * @param vToken Their validation code.
     */
    private async sendVerificationEmail(user: User, vToken: VerificationToken): Promise<boolean> {
        if (user == null) {
            throw new NullArgumentError('user');
        }
        else if (vToken == null) {
            throw new NullArgumentError('vToken');
        }

        let validationEmail: IEmail = new TextEmail(user.email,
            "Account Confirmation",
            "Thanks for joining! Your confirmation code is: " + vToken.code
        );

        return this.emailSender.sendEmail(validationEmail);
    }
}