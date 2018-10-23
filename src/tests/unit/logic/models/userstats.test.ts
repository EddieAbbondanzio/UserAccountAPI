import { expect } from 'chai';
import 'mocha';
import { UserStats } from '../../../../logic/models/userstats';
import { User } from '../../../../logic/models/user';

describe('UserStats', () => {
    describe('constructor()', () => {
        it('no params leaves it empty', () => {
            let userStats: UserStats = new UserStats();
            expect(userStats).to.be.an('object').that.is.empty;
        });

        it('user is defined when passed', () => {
            let user: User = new User();
            let userStats: UserStats = new UserStats(user);

            expect(userStats.user).to.equal(user);
        });
    });
});