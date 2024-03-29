import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import {SharedUser} from "@/models/dtos/SharedUser";
import ClonableMixin, {Clonable} from "@/models/mixins/clonable";
import {Section} from "@/models/dtos/Section";
import {DefaultSection} from "@/models/dtos/DefaultSection";

export type ClonableList = List & Clonable;

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

        this._sections = [new DefaultSection("irrelevent")];

        Object.assign(this, ClonableMixin)
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
        return this._sections.sort((a, b) => {
            if (a instanceof DefaultSection) {
                return -1
            } else if (b instanceof DefaultSection) {
                return 1
            }

            return 0
        });
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
