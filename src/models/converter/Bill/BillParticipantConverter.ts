import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";
import {
    BillParticipantBalanceConverter,
    BillParticipantBalanceConverterPayload
} from "@/models/converter/Bill/BillParticipantBalanceConverter";

export type BillParticipantConverterPayload = {
    id: string,
    email: string,
    first_name?: string | null,
    last_name?: string | null,

    balances?: Array<BillParticipantBalanceConverterPayload>
}
export const BillParticipantConverter = {
    fromFirestore(payload: BillParticipantConverterPayload): BillParticipant {
        const dto = new BillParticipant(payload.id, payload.email);

        if ('first_name' in payload && payload.first_name) {
            dto.firstName = payload.first_name;
        }

        if ('last_name' in payload && payload.last_name) {
            dto.lastName = payload.last_name
        }

        if ('balances' in payload && payload.balances) {
            for (const balancePayload of payload.balances) {
                dto.balances.push(BillParticipantBalanceConverter.fromFirestore(balancePayload))
            }
        }

        return dto;
    }

}
