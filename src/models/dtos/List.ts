import {Section} from "@/models/dtos/Section";
import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import {SharedUser} from "@/models/dtos/SharedUser";
import Clonable from "@/models/mixins/clonable";

export class List implements IdentifiableRecord {
    private _id: string;
    private _name: string;
    private _isSharedWithCurrentUser = false;
    private _originalAuthor: string | null = null;
    private _originalAuthorEmail: string | null = null;

    private _sections: Section[] = [];
    private _sharedWiths: SharedUser[] = [];

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;

        Object.assign(this, Clonable)
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get sections(): Section[] {
        return this._sections;
    }

    set sections(value: Section[]) {
        this._sections = value;
    }


    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id;
    }

    get sharedWiths(): SharedUser[] {
        return this._sharedWiths;
    }

    set sharedWiths(value: SharedUser[]) {
        this._sharedWiths = value;
    }

    get originalAuthor(): string | null {
        return this._originalAuthor;
    }

    set originalAuthor(value: string | null) {
        this._originalAuthor = value;
    }

    get originalAuthorEmail(): string | null {
        return this._originalAuthorEmail;
    }

    set originalAuthorEmail(value: string | null) {
        this._originalAuthorEmail = value;
    }

    get isSharedWithCurrentUser(): boolean {
        return this._isSharedWithCurrentUser;
    }

    set isSharedWithCurrentUser(value: boolean) {
        this._isSharedWithCurrentUser = value;
    }
}
