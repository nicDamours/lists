import {addDays, differenceInDays} from "date-fns";
import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import {WeekPlanDays} from "@/models/dtos/WeekPlan/WeekPlanDays";
import UUID from "@/utils/UUID";
import {SharedUser} from "@/models/dtos/SharedUser";

export class WeekPlan implements IdentifiableRecord {

    id: string;

    private _days: Array<WeekPlanDays> = [];
    private _startDate: Date;
    private _endDate: Date;

    constructor(id: string, startDate: Date, endDate: Date) {
        this.id = id;
        this._startDate = startDate;
        this._endDate = endDate;

        this._sharingId = null;

        this._days = new Array(Math.abs(differenceInDays(startDate, endDate)) + 1).fill(undefined).map((_, index) => {
            return new WeekPlanDays(UUID.uuidv4(), "", "", "", addDays(new Date(startDate), index))
        });
    }

    private _author: SharedUser | null = null;

    private _sharingId: string | null;

    get days(): Array<WeekPlanDays> {
        return this._days;
    }

    set days(value: Array<WeekPlanDays>) {
        this._days = value;
    }

    get startDate(): Date {
        return this._startDate;
    }

    set startDate(value: Date) {
        this._startDate = value;
    }

    get endDate(): Date {
        return this._endDate;
    }

    set endDate(value: Date) {
        this._endDate = value;
    }

    get author(): SharedUser | null {
        return this._author;
    }

    set author(value: SharedUser | null) {
        this._author = value;
    }

    get sharingId(): string | null {
        return this._sharingId;
    }

    set sharingId(value: string | null) {
        this._sharingId = value;
    }

    setDay(day: WeekPlanDays, date: Date) {
        const index = this.days.findIndex(day => day.date.getTime() === date.getTime());

        if (index !== -1) {
            this.days[index] = day;
        }
    }

    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id
    }
}
