import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import {SharedUser} from "@/models/dtos/SharedUser";

export class WeekSharing implements IdentifiableRecord {

    constructor(id: string, author: SharedUser, target: SharedUser) {
        this._id = id;
        this._author = author;
        this._target = target
    }

    private _id: string;

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    private _author: SharedUser;

    get author(): SharedUser {
        return this._author;
    }

    set author(value: SharedUser) {
        this._author = value;
    }

    private _target: SharedUser;

    get target(): SharedUser {
        return this._target;
    }

    set target(value: SharedUser) {
        this._target = value;
    }

    isEqual(other: IdentifiableRecord): boolean {
        return false;
    }
}
