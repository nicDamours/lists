import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import Clonable from "@/models/mixins/clonable";

export class Item implements IdentifiableRecord{
    private _id: string;
    private _name!: string;
    private _done = false;
    private _quantity = 1;
    private _editing = false;
    private _index: number|null = null;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;

        Object.assign(this, Clonable);
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get done(): boolean {
        return this._done;
    }

    set done(value: boolean) {
        this._done = value;
    }

    get quantity(): number {
        return this._quantity;
    }

    set quantity(value: number) {
        this._quantity = value;
    }

    get editing(): boolean {
        return this._editing;
    }

    set editing(value: boolean) {
        this._editing = value;
    }

    get index(): number|null {
        return this._index;
    }

    set index(value: number|null) {
        this._index = value;
    }

    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id;
    }
}
