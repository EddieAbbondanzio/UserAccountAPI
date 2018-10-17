import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from "../user/user";
import { RandomUtils } from '../../util/randomutils';

/**
 * Token that is sent to a user to validate their
 * email address. User's aren't considered active 
 * unless they have a valid email.
 */
@Entity({ name: "VerificationToken"})
export class VerificationToken {
    /**
     * The ideal code length for validation tokens.
     */
    public static CODE_LENGTH: number = 6;

    /**
     * The unique id of the validation token.
     */
    @PrimaryGeneratedColumn()
    public id: number;

    /**
     * The user that this validation token belongs to.
     */
    @JoinColumn()
    @OneToOne(type => User, user => user.stats, {primary: true})
    public user: User;

    /**
     * The unique code that the user must pass back.
     */
    @Column("char", {length: VerificationToken.CODE_LENGTH, nullable: false})
    public code: string;

    constructor(user?: User) {
        if(user){
            this.user = user;
            this.code = RandomUtils.generateRandomString(VerificationToken.CODE_LENGTH);
        }
    }
}