import { DatabaseService } from "../common/databaseservice";
import { ServiceType } from "../common/servicetype";
import { NullArgumentError } from "../../common/error/types/nullargumenterror";
import { TextEmail } from "../email/types/textemail";
import { IEmail } from "../email/types/iemail";
import { User } from "../models/user";
import { VerificationToken } from "../models/verificationtoken";
import { IEmailSender } from "../email/iemailsender";
import { ResetToken } from "../models/resettoken";
import { AuthenticationError } from "../../common/error/types/authenticationerror";
import { ValidatorResult } from "../validation/validatorresult";
import { ArgumentError } from "../../common/error/types/argumenterror";
import { ValidationError } from "../validation/validationerror";
import { UserUpdateValidator } from "../validation/user/validators/userupdatevalidator";
import { Database } from "../common/database";
import { injectable, inject } from 'inversify';
import { ZohoEmailService } from "../email/zohoemailsender";
import { IOC_TYPES } from "../../common/ioc/ioctypes";

/**
 * Service for everything related to the user's
 * account.
 */
@injectable()
export class AccountService extends DatabaseService {
    /**
     * The type of service it is.
     */
    readonly serviceType: ServiceType = ServiceType.Account;

    /**
     * The validator to validate a user being updated.
     */
    private userUpdateValidator: UserUpdateValidator;

    /**
     * The service for sending emails.
     */
    private emailSender: IEmailSender;

    /**
     * Create a new AccountService for managing the account details
     * of Users.
     * @param database The database to query from.
     * @param emailSender The utility for sending users emails.
     */
    constructor(@inject(IOC_TYPES.Database) database: Database, 
                @inject(IOC_TYPES.EmailSender) emailSender: IEmailSender) {
        super(database);

        this.emailSender = emailSender;
        this.userUpdateValidator = new UserUpdateValidator();
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
     * Update an existing user in the database.
     * @param user The user to update
     */
    public async updateInfo(user: User): Promise<void> {
        if(!user || isNaN(user.id)){
            throw new ArgumentError('user');
        }
        
        let validatorResult: ValidatorResult = this.userUpdateValidator.validate(user);

        if(!validatorResult.isValid){
            throw new ValidationError('Failed to update user.', validatorResult);
        }
        
        await this.database.userRepo.update(user);
    }

    /**
     * Send the user their validation code via an email.
     * @param user The user to re email.
     * @param vToken Their validation code.
     */
    public async sendVerificationEmail(user: User, vToken?: VerificationToken): Promise<void> {
        if (user == null) {
            throw new NullArgumentError('user');
        }

        //Don't waste resources sending to deleted, or previously verified.
        if (user.isVerified || user.isDeleted) {
            return;
        }

        //Do we need to issue a token?
        if (vToken == null) {
            vToken = new VerificationToken(user);
            await this.database.verificationTokenRepo.add(vToken);
        }

        let validationEmail: IEmail = new TextEmail(user.email,
            "Account Confirmation",
            "Thanks for joining! Your confirmation code is: " + vToken.code
        );

        return this.emailSender.sendEmail(validationEmail);
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
        if (user.isVerified || user.isDeleted) {
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
}