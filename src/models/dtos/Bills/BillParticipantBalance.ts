export class BillParticipantBalance {

    constructor(amount: number, target: string, currency: string) {
        this._amount = amount
        this._target = target;
        this._currency = currency;
    }

    private _amount: number;

    get amount(): number {
        return this._amount;
    }

    set amount(value: number) {
        this._amount = value;
    }

    private _target: string;

    get target(): string {
        return this._target;
    }

    set target(value: string) {
        this._target = value;
    }

    private _currency: string;

    get currency(): string {
        return this._currency;
    }

    set currency(value: string) {
        this._currency = value;
    }
}
