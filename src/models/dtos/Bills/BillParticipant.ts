import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import {BillParticipantBalance} from "@/models/dtos/Bills/BillParticipantBalance";

export class BillParticipant implements IdentifiableRecord {
    id: string;

    constructor(id: string, email: string) {
        this.id = id;
        this._email = email;
        this._firstName = null;
        this._lastName = null
        this._balances = [];
    }

    private _email: string

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    private _firstName: string | null;

    get firstName(): string | null {
        return this._firstName;
    }

    set firstName(value: string | null) {
        this._firstName = value;
    }

    private _lastName: string | null;

    get lastName(): string | null {
        return this._lastName;
    }

    set lastName(value: string | null) {
        this._lastName = value;
    }

    private _balances: Array<BillParticipantBalance>

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
