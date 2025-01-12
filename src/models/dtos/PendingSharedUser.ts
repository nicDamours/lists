import {SharedUser} from "@/models/dtos/SharedUser";
import ShareRequest from "@/models/dtos/ShareRequest";

export class PendingSharedUser extends SharedUser {

    private readonly _pendingRequest: ShareRequest;

    constructor(id: string, email: string | null, pendingRequest: ShareRequest) {
        super(id, email);
        this._pendingRequest = pendingRequest;
    }

    get pendingRequest() {
        return this._pendingRequest
    }
}
