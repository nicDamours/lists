import {BillParticipantBalance} from "@/models/dtos/Bills/BillParticipantBalance";

export type BillParticipantBalanceConverterPayload = {
    amount: number,
    target: string,
    currency: string
}
export const BillParticipantBalanceConverter = {
    fromFirestore(payload: BillParticipantBalanceConverterPayload): BillParticipantBalance {
        return new BillParticipantBalance(payload.amount, payload.target, payload.currency);
    }
}
