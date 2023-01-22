import ShareRequest from "@/models/dtos/ShareRequest";

export default abstract class ShareWeeksRequest extends ShareRequest {
    abstract getType(): string;
}
