import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { RandomUtils } from '../../util/randomutils';
import { User } from './user';

/**
 * Token that is sent to a user to reset their password.
 * This is required when they attempt to reset their password,
 * else it is rejected.
 */
@Entity({name: "ResetToken"})
export class ResetToken {
    /**
     * The ideal code length for reset tokens.
     */
    public static CODE_LENGTH: number = 8;

    /**
     * The unique id of the reset token.
     */
    @PrimaryGeneratedColumn()
    public id: number;

    /**
     * The user that this reset token belongs to.
     */
    @JoinColumn()
    @OneToOne(type => User, user => user.stats, {primary: true})
    public user: User;

    /**
     * The unique code that the user must pass back.
     */
    @Column("char", {length: ResetToken.CODE_LENGTH, nullable: false})
    public code: string;

    /**
     * Create a new reset token for a user.
     * @param user The user to create a reset token for.
     */
    constructor(user?: User){
        if(user){
            this.user = user;
            this.code = RandomUtils.generateRandomString(ResetToken.CODE_LENGTH);
        }
    }
}