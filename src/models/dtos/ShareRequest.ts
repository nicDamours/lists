import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";

export default abstract class ShareRequest implements IdentifiableRecord {
    private readonly _id: string;
    private readonly _targetEmail: string;
    private readonly _targetId: string;
    private readonly _authorEmail: string;
    private readonly _authorId: string;
    private _isCurrentUserTheAuthor = false;

    constructor(id: string, targetId: string, targetEmail: string, authorEmail: string, authorId: string) {
        this._id = id;
        this._targetEmail = targetEmail;
        this._targetId = targetId;
        this._authorEmail = authorEmail;
        this._authorId = authorId;
    }

    get id(): string {
        return this._id;
    }

    get targetId(): string {
        return this._targetId;
    }

    get authorEmail(): string {
        return this._authorEmail;
    }

    get authorId(): string {
        return this._authorId;
    }

    get targetEmail(): string {
        return this._targetEmail;
    }

    get isCurrentUserTheAuthor(): boolean {
        return this._isCurrentUserTheAuthor;
    }

    set isCurrentUserTheAuthor(value: boolean) {
        this._isCurrentUserTheAuthor = value;
    }

    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id;
    }
}
