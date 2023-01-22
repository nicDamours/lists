import ShareRequest from "@/models/dtos/ShareRequest";

export default class ShareListRequest extends ShareRequest {
    private readonly _listId: string;
    private readonly _listName: string;

    constructor(id: string, targetId: string, targetEmail: string, authorEmail: string, authorId: string, listId: string, listName: string) {
        super(id, targetId, targetEmail, authorEmail, authorId)
        this._listId = listId;
        this._listName = listName;
    }

    get listId(): string {
        return this._listId;
    }

    get listName(): string {
        return this._listName;
    }
}
