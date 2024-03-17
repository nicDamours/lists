import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import {BillSplitType} from "@/models/enums/BillSplitType";
import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";

export class BillTransaction implements IdentifiableRecord {
    id: string;

    private _description: string
    private _currency: string;
    private _date: Date;
    private _splitType: BillSplitType;
    private _creator: BillParticipant | null;
    private _payer: BillParticipant | null

    constructor(id: string) {
        this.id = id;
        this._description = "";
        this._amount = null;
        this._currency = "cad"
        this._date = new Date()
        this._splitType = BillSplitType.EQUALS;
        this._creator = null;
        this._payer = null;
    }

    private _amount: number | null;

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get amount(): number | null {
        return this._amount;
    }

    set amount(value: number | null) {
        this._amount = value;
    }
    get currency(): string {
        return this._currency;
    }

    set currency(value: string) {
        this._currency = value;
    }
    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }

    get splitType(): BillSplitType {
        return this._splitType;
    }

    set splitType(value: BillSplitType) {
        this._splitType = value;
    }

    get creator(): BillParticipant | null {
        return this._creator;
    }

    set creator(value: BillParticipant | null) {
        this._creator = value;
    }

    get payer(): BillParticipant | null {
        return this._payer;
    }

    set payer(value: BillParticipant | null) {
        this._payer = value;
    }

    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id
    }

}
