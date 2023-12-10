import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";
import {
    BillParticipantBalanceConverter,
    BillParticipantBalanceConverterPayload
} from "@/models/converter/Bill/BillParticipantBalanceConverter";

export type BillParticipantConverterPayload = {
    id: string,
    email: string,
    display_name?: string | null,

    balances?: Array<BillParticipantBalanceConverterPayload>
}
export const BillParticipantConverter = {
    fromFirestore(payload: BillParticipantConverterPayload): BillParticipant {
        const dto = new BillParticipant(payload.id, payload.email);

        if ('display_name' in payload && payload.display_name) {
            dto.displayName = payload.display_name;
        }

        if ('balances' in payload && payload.balances) {
            for (const balancePayload of payload.balances) {
                dto.balances.push(BillParticipantBalanceConverter.fromFirestore(balancePayload))
            }
        }

        return dto;
    },
    toFirestore(modelObject: BillParticipant) {
        return {
            id: modelObject.id,
            email: modelObject.email,
            displayName: modelObject.displayName
        }
    }
}
