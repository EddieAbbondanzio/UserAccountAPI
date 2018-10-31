import { UserService } from "./userservice";

/**
 * The user service handles everything related to users except
 * for their passwords.
 */
export interface IUserService extends UserService { }