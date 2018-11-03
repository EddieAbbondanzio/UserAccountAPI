import { UserService } from "../../services/userservice";

/**
 * The user service handles everything related to users except
 * for their passwords.
 */
export interface IUserService extends UserService { }