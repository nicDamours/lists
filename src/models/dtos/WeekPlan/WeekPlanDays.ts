import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";

export class WeekPlanDays implements IdentifiableRecord {
    id: string;

    private _dinner = "";
    private _supper = "";
    private _activities = "";
    private _date: Date;

    constructor(id: string, dinner: string, supper: string, activities: string, date: Date) {
        this.id = id;
        this._dinner = dinner;
        this._supper = supper;
        this._activities = activities;

        this._date = date;
    }

    get dinner(): string {
        return this._dinner;
    }

    set dinner(value: string) {
        this._dinner = value;
    }

    get supper(): string {
        return this._supper;
    }

    set supper(value: string) {
        this._supper = value;
    }

    get activities(): string {
        return this._activities;
    }

    set activities(value: string) {
        this._activities = value;
    }

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }


    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id;
    }
}
