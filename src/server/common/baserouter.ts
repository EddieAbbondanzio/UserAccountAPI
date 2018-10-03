import { Router } from 'express';

/**
 * A base class for building off of that will provide some preset 
 * functionality to any service.
 */
export abstract class BaseController {
    /**
     * The underlying Express Router.
     */
    protected router: Router;

    /**
     * Create a new base router that will handle
     * extra functionality for the server.
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     * Method required by the router for preparing routes 
     * and such within it.
     */
    protected abstract init():void;

    /**
     * Getter for retrieving the express
     * router of this custom router.
     */
    public getRouter(): Router {
        return this.router;
    }
}