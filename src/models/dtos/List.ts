import {Section} from "@/models/dtos/Section";
import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";

export class List implements IdentifiableRecord {
    private _id: string;
    private _name: string;

    private _sections: Section[] = [];

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
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

    get sections(): Section[] {
        return this._sections;
    }

    set sections(value: Section[]) {
        this._sections = value;
    }


    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id;
    }

    clone(): List {
        const cloned = new List(this.id, this.name);

        cloned.sections = [...this.sections];

        return cloned;
    }
}
