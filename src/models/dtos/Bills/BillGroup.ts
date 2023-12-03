import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";

export class BillGroup implements IdentifiableRecord {
    id: string;

    constructor(id: string) {
        this.id = id;
        this._name = null;
        this._participants = []
    }

    private _name: string | null;

    get name(): string | null {
        return this._name;
    }

    set name(value: string | null) {
        this._name = value;
    }

    private _participants: Array<BillParticipant>;

    get participants(): Array<BillParticipant> {
        return this._participants;
    }

    set participants(value: Array<BillParticipant>) {
        this._participants = value;
    }

    getBalanceForParticipant(participantId: string): number {
        const requestedParticipant = this.participants.find(item => item.id === participantId);

        if (!requestedParticipant) {
            throw new Error("Could not find participant with in in group")
        }

        return requestedParticipant.balances.map(item => item.amount).reduce((col, item) => col += item, 0);
    }

    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id;
    }

}
