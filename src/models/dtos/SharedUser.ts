import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";

export class SharedUser implements IdentifiableRecord {
    private _id: string;
    private _email: string | null;
    private _name: string | null;

    constructor(id: string, email: string | null, name: string | null) {
        this._id = id;
        this._email = email;
        this._name = name;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get email(): string | null {
        return this._email;
    }

    set email(value: string | null) {
        this._email = value;
    }

    get name(): string | null {
        return this._name;
    }

    set name(value: string | null) {
        this._name = value;
    }

    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id;
    }
}
