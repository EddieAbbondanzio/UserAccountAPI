import { User } from "../user/user";
import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, OneToOne } from "typeorm";
import { RandomUtils } from "../../util/randomutils";

/**
 * A login gives user access to portions of the
 * API that are locked down. Logins are simple ways
 * to track a users login from some device.
 */
@Entity({name: "UserLogin"})
export class UserLogin {
    /**
     * The ideal code length for the unique code.
     */
    public static CODE_LENGTH: number = 16;

    /**
     * Database table index for the login. This 
     * is only used by the foreign key relationship.
     */
    @PrimaryGeneratedColumn()
    public id: number;

    /**
     * The user that this login belongs to. A user may
     * only have one login at a time.
     */
    @OneToOne(type => User)
    public user: User;

    /**
     * The unique code for the login. These
     * are passed around to prevent from handing
     * out the JWT to game servers.
     */
    @Column("char", {length: UserLogin.CODE_LENGTH, nullable: false})
    public code: string;

    /**
     * The JWT associated with the login. These are never stored in
     * the database since they are a one time use.
     */
    public token: string;

    /**
     * The date that the login occured. Not really
     * used for anything.
     */
    @CreateDateColumn()
    public loginDate: Date;

    /**
     * Create a new user login.
     * @param user The user to create a login for.
     */
    constructor(user?: User){
        if(user){
            this.user = user;
            this.code = RandomUtils.generateRandomString(UserLogin.CODE_LENGTH);
        }
    }
} 