import {SharedUser} from "@/models/dtos/SharedUser";
import {WeekPlan} from "@/models/dtos/WeekPlan/WeekPlan";
import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";

export class WeekSharing implements IdentifiableRecord {

    private _weekAuthor: SharedUser;

    constructor(id: string, weekAuthor: SharedUser, week: WeekPlan) {
        this._id = id;
        this._weekAuthor = weekAuthor
        this._week = week;
    }

    private _id: string;

    private _week: WeekPlan;

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get weekAuthor(): SharedUser {
        return this._weekAuthor;
    }

    set weekAuthor(value: SharedUser) {
        this._weekAuthor = value;
    }

    get week(): WeekPlan {
        return this._week;
    }

    set week(value: WeekPlan) {
        this._week = value;
    }

    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id;
    }
}
