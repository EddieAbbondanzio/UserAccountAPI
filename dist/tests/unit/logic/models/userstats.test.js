"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const userstats_1 = require("../../../../logic/models/userstats");
const user_1 = require("../../../../logic/models/user");
describe('UserStats', () => {
    describe('constructor()', () => {
        it('no params leaves it empty', () => {
            let userStats = new userstats_1.UserStats();
            chai_1.expect(userStats).to.be.an('object').that.is.empty;
        });
        it('user is defined when passed', () => {
            let user = new user_1.User();
            let userStats = new userstats_1.UserStats(user);
            chai_1.expect(userStats.user).to.equal(user);
        });
    });
});
//# sourceMappingURL=userstats.test.js.map