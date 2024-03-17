import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import {BillSplitType} from "@/models/enums/BillSplitType";
import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";

export class BillTransaction implements IdentifiableRecord {
    id: string;

    constructor(id: string) {
        this.id = id;
        this._description = "";
        this._amount = 0;
        this._currency = "cad"
        this._date = new Date()
        this._splitType = BillSplitType.EQUALS;
        this._creator = null;
        this._payer = null;
    }

    private _description: string

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    private _amount: number;

    get amount(): number {
        return this._amount;
    }

    set amount(value: number) {
        this._amount = value;
    }

    private _currency: string;

    get currency(): string {
        return this._currency;
    }

    set currency(value: string) {
        this._currency = value;
    }

    private _date: Date;

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }

    private _splitType: BillSplitType;

    get splitType(): BillSplitType {
        return this._splitType;
    }

    set splitType(value: BillSplitType) {
        this._splitType = value;
    }

    private _creator: BillParticipant | null;

    get creator(): BillParticipant | null {
        return this._creator;
    }

    set creator(value: BillParticipant | null) {
        this._creator = value;
    }

    private _payer: BillParticipant | null

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
