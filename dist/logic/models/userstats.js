"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
/**
 * The stats of the user. Not much is collected other than
 * points, and counts. Along with their join date.
 */
let UserStats = class UserStats {
    /**
     * Create a new user stats.
     * @param user The user to create the stats for.
     */
    constructor(user) {
        if (user) {
            this.user = user;
        }
    }
};
__decorate([
    typeorm_1.JoinColumn(),
    typeorm_1.OneToOne(type => user_1.User, user => user.stats, { primary: true }),
    __metadata("design:type", user_1.User)
], UserStats.prototype, "user", void 0);
__decorate([
    typeorm_1.Column("datetime", { default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], UserStats.prototype, "joinedDate", void 0);
UserStats = __decorate([
    typeorm_1.Entity({ name: "UserStats" }),
    __metadata("design:paramtypes", [user_1.User])
], UserStats);
exports.UserStats = UserStats;
//# sourceMappingURL=userstats.js.map