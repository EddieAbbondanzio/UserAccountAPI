import { PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * Base class for all entity objects to derive from.
 * Automatically gives them a (few) basic column(s).
 */
export abstract class NumericIdEntity {
    /**
     * The automatically generated unique id of the 
     * entity object. Reduces how redundant the code is.
     */
    @PrimaryGeneratedColumn("increment", {type: "bigint", unsigned: true})
    public id: number;

    /**
     * We don't allow anything to actually be 
     * deleted since it ruins the data integrity.
     */
    @Column({default: false})
    public isDeleted: boolean;
}