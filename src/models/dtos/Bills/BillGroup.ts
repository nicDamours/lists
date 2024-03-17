import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";
import {BillParticipantBalance} from "@/models/dtos/Bills/BillParticipantBalance";
import BillUtils from "@/utils/Bill/BillUtils";
import {BillTransaction} from "@/models/dtos/Bills/BillTransaction";

export class BillGroup implements IdentifiableRecord {
    id: string;
    private _participants: BillParticipant[];
    constructor(id: string) {
        this.id = id;
        this._name = null;
        this._participants = []
        this._transactions = []
    }

    private _transactions: BillTransaction[];

    private _name: string | null;

    get name(): string | null {
        return this._name;
    }

    set name(value: string | null) {
        this._name = value;
    }


    get participants(): BillParticipant[] {
        return this._participants;
    }

    set participants(value: BillParticipant[]) {
        this._participants = value;
    }

    get transactions(): BillTransaction[] {
        return this._transactions;
    }

    set transactions(value: BillTransaction[]) {
        this._transactions = value;
    }

    getBalanceForParticipant(participantId: string): number {
        return BillUtils.getAmountForBalances(this.getBalanceObjectsForParticipant(participantId));
    }

    getBalanceObjectsForParticipant(participantId: string): Array<BillParticipantBalance> {
        const requestedParticipant = this.participants.find(item => item.id === participantId);

        if (!requestedParticipant) {
            throw new Error(`Could not find participant with id ${participantId} in group`)
        }


        return requestedParticipant.balances
    }

    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id;
    }

}
