import { User } from "../user/user";
import { ManyToOne, Index, PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import uuidv4 = require('uuid/v4');

/**
 * A login gives user access to portions of the
 * API that are locked down. Logins are simple ways
 * to track a users login from some device.
 */
@Entity({name: "UserLogin"})
export class UserLogin {
    /**
     * Database table index for the login. This 
     * is only used by the foreign key relationship.
     */
    @PrimaryGeneratedColumn("increment", {type: "bigint", unsigned: true})
    public id: number;

    /**
     * The user that this login belongs to. A user may
     * only have one login at a time.
     */
    @Index("IX_loginUserId")
    @ManyToOne(type => User)
    public user: User;

    /**
     * The unique GUID for the login. These
     * are passed around to prevent from handing
     * out the JWT to game servers.
     */
    @Column("varchar", {nullable: false})
    public guid: string;

    /**
     * The date that the login occured. Not really
     * used for anything.
     */
    @CreateDateColumn()
    public loginDate: Date;

    /**
     * Generate a new login that has a unique GUID
     * associated with it.
     * @param user The user to build a login for.
     */
    public static GenerateLogin(user: User): UserLogin {
        let userLogin  = new UserLogin();
        userLogin.user = user;
        userLogin.guid = uuidv4();

        return userLogin;
    }
} 