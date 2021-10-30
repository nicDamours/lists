import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";

export class SharedUser implements IdentifiableRecord {
    private _id: string;
    private _email: string | null;

    constructor(id: string, email: string | null) {
        this._id = id;
        this._email = email
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

    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id;
    }
}
