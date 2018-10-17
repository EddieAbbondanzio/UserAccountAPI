import { Entity, Column, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User} from './user';

/**
 * The stats of the user. Not much is collected other than
 * points, and counts. Along with their join date.
 */
@Entity({ name: "UserStats" })
export class UserStats {
    /**
     * The user object that these stats
     * belong to.
     */
    @JoinColumn()
    @OneToOne(type => User, user => user.stats, {primary: true})
    public user: User;

    /**
     * The date that the user first created
     * their account on.
     */
    @Column("datetime", {default: () => 'CURRENT_TIMESTAMP'})
    public joinedDate: Date;

    /**
     * Create a new user stats.
     * @param user The user to create the stats for.
     */
    constructor(user?: User){
        if(user){
            this.user = user;
        }
    }
}