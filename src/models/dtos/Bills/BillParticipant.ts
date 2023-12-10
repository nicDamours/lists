import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import {BillParticipantBalance} from "@/models/dtos/Bills/BillParticipantBalance";

export class BillParticipant implements IdentifiableRecord {
    id: string;
    private _balances: BillParticipantBalance[]

    constructor(id: string, email: string | null) {
        this.id = id;
        this._email = email;
        this._displayName = null;
        this._balances = [];
    }

    private _email: string | null

    get email(): string | null {
        return this._email;
    }

    set email(value: string | null) {
        this._email = value;
    }

    private _displayName: string | null;

    get displayName(): string | null {
        return this._displayName;
    }

    set displayName(value: string | null) {
        this._displayName = value;
    }

    get balances(): Array<BillParticipantBalance> {
        return this._balances;
    }

    set balances(value: Array<BillParticipantBalance>) {
        this._balances = value;
    }

    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id;
    }

}
