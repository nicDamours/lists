import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import {SharedUser} from "@/models/dtos/SharedUser";
import {WeekPlan} from "@/models/dtos/WeekPlan/WeekPlan";

export class WeekSharing implements IdentifiableRecord {
    constructor(id: string, weekAuthor: SharedUser, weeks: Array<WeekPlan> = []) {
        this._id = id;
        this._weekAuthor = weekAuthor;
        this._weeks = weeks
    }

    private _id: string;

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    private _weekAuthor: SharedUser;

    get weekAuthor(): SharedUser {
        return this._weekAuthor;
    }

    set weekAuthor(value: SharedUser) {
        this._weekAuthor = value;
    }

    private _weeks: WeekPlan[] = [];

    get weeks(): WeekPlan[] {
        return this._weeks;
    }

    set weeks(value: WeekPlan[]) {
        this._weeks = value;
    }

    isEqual(other: IdentifiableRecord): boolean {
        return false;
    }
}
