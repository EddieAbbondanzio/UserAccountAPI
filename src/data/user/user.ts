import { Entity, Column, OneToOne, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserStats } from './userstats';
import { PasswordHasher } from '../../logic/security/passwordhasher';
import { UserRegistration } from './userregistration';
import { UserLogin } from '../login/userlogin';

/**
 * User object of the service. Represents an individual that 
 * has registered with the system and has some roles, and stats.
 */
@Entity({name: "User"})
export class User {
    /**
     * The minimum number of characters in a username.
     */
    public static MIN_USERNAME_LENGTH: number = 4;

    /**
     * The maximum number of characters in a username.
     */
    public static MAX_USERNAME_LENGTH:number = 24;

    /**
     * The maximum number of characters in a user's email.
     */
    public static MAX_EMAIL_LENGTH: number = 64;

    /**
     * The minimum length to allow for passwords.
     */
    public static MIN_PASSWORD_LENGTH: number = 8;

    /**
     * The automatically generated unique id of the 
     * entity object. Reduces how redundant the code is.
     */
    @Index("IX_userId")
    @PrimaryGeneratedColumn()
    public id: number;

    /**
     * The user's unique username.
     */
    @Index("IX_userUsername")
    @Column({unique: true})
    public username: string;

    /**
     * The secret hash that is used to validate
     * a user's login credentials against.
     */
    @Column("varchar")
    public passwordHash: string;

    /**
     * The actual name of the user.
     */
    @Column("varchar", {length: User.MAX_USERNAME_LENGTH})
    public name: string;

    /**
     * The email of the user. This is optional and
     * therefore can be null.
     */
    @Column("varchar", { length: User.MAX_EMAIL_LENGTH})
    public email: string;
    
    /**
     * If the user has verified their email address.
     */
    @Column({default: false})
    public isVerified: boolean;

    /**
     * We don't allow anything to actually be 
     * deleted since it ruins the data integrity.
     */
    @Column({default: false})
    public isDeleted: boolean;

    /**
     * The stats of the user. This is sync up 
     * to symbolize a foreign key relation between the pair.
     */
    @OneToOne(type => UserStats, stats => stats.user)
    public stats: UserStats;

    /**
     * The user's login. If any.
     */
    @OneToOne(type => UserLogin, login => login.user)
    public login: UserLogin;

    /**
     * Update the password hash of the user. This will
     * pass the password through the hasher.
     * @param The new password to hash.
     */
    public async setPassword(password: string): Promise<void> {
        if(password.length < User.MIN_PASSWORD_LENGTH){
            throw new Error("Password is too short!");
        }

        this.passwordHash = await PasswordHasher.generateHash(password);
    }

    /**
     * Check to see if the passed in password matches the
     * hash stored on the user.
     * @param password The password to test.
     * @returns True if the password matches the hash.
     */
    public async validatePassword(password: string) : Promise<boolean> {
        return await PasswordHasher.validateHash(password, this.passwordHash);
    }

    /**
     * Generate a new user using the passed in registration.
     * If the registration is invalid, an error will be thrown.
     * Be sure to call .validate() on the registration!
     * @param registration The registration to build the user from.
     */
    public static async fromRegistration(registration: UserRegistration): Promise<User> {
        if(!registration.validate()){
            throw new Error("Registration is invalid.");
        }

        //Build the user object.
        let user = new User();
        user.username = registration.username;
        user.name     = registration.name;
        user.email    = registration.email;
        user.stats    = new UserStats();
        user.stats.user = user;

        await user.setPassword(registration.password);
        return user;
    }
}