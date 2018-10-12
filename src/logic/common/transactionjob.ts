import { EntityManager } from "typeorm";

/**
 * Represents a function that can be passed to
 * the service to run within a transaction.
 */
export interface TransactionJob<T> {
    /**
     * The job to run
     */
    (manager: EntityManager): Promise<T>;
}