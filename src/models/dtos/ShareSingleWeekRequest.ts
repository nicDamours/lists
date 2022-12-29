import ShareWeeksRequest from "@/models/dtos/ShareWeeksRequest";

export default class ShareSingleWeekRequest extends ShareWeeksRequest {
    private readonly _startDate: Date;
    private readonly _endDate: Date;

    constructor(id: string, targetId: string, targetEmail: string, authorEmail: string, authorId: string, startDate: Date, endDate: Date) {
        super(id, targetId, targetEmail, authorEmail, authorId)

        this._endDate = endDate;
        this._startDate = startDate;
    }

    get startDate(): Date {
        return this._startDate;
    }

    get endDate(): Date {
        return this._endDate;
    }

    getType(): string {
        return "single";
    }
}
