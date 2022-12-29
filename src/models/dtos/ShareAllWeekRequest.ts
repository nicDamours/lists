import ShareWeeksRequest from "@/models/dtos/ShareWeeksRequest";

export default class ShareAllWeekRequest extends ShareWeeksRequest {
    getType(): string {
        return "all";
    }
}
