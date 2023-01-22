import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import {SharedUser} from "@/models/dtos/SharedUser";

export class WeekShared implements IdentifiableRecord {
    constructor(id: string, target: SharedUser, type: "single" | "all") {
        this._id = id;
        this._target = target;
        this._type = type;
    }

    private _id: string;

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    private _target: SharedUser;

    get target(): SharedUser {
        return this._target;
    }

    set target(value: SharedUser) {
        this._target = value;
    }

    private _type: "single" | "all";

    get type(): "single" | "all" {
        return this._type;
    }

    set type(value: "single" | "all") {
        this._type = value;
    }

    private _weekId: string | null = null;

    get weekId(): string | null {
        return this._weekId;
    }

    set weekId(value: string | null) {
        this._weekId = value;
    }

    isEqual(other: IdentifiableRecord): boolean {
        return other.id === this.id;
    }
}
