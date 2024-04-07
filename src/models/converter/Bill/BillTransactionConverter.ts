import {DocumentData, Timestamp} from "firebase/firestore";
import {BillTransaction} from "@/models/dtos/Bills/BillTransaction";
import {
    BillParticipantConverter,
    BillParticipantConverterPayload
} from "@/models/converter/Bill/BillParticipantConverter";
import {BillSplitType} from "@/models/enums/BillSplitType";

export type BillTransactionConverterPayload = {
    id: string,
    date?: Timestamp,

    description: string,

    amount: number,

    currency: string,

    payer?: BillParticipantConverterPayload,

    creator?: BillParticipantConverterPayload,

    splitType?: string
}

export const BillTransactionConverter = {
    fromFirestore(payload: BillTransactionConverterPayload): BillTransaction {
        const data = payload;

        const dto = new BillTransaction(payload.id);

        dto.description = data.description;

        dto.amount = data.amount
        dto.currency = data.currency;

        if ('date' in data && data.date) {
            dto.date = data.date.toDate()
        }

        switch (data.splitType) {
            case BillSplitType.PAID_BY_YOU_SPLIT_EQUALS:
                dto.splitType = BillSplitType.PAID_BY_YOU_SPLIT_EQUALS;
                break;
            case BillSplitType.FULLY_OWED:
                dto.splitType = BillSplitType.FULLY_OWED;
                break;
            case BillSplitType.OWE_FULLY:
                dto.splitType = BillSplitType.OWE_FULLY;
                break;
            default:
                dto.splitType = BillSplitType.PAID_BY_YOU_SPLIT_EQUALS;
                break;
        }

        if ('creator' in data && data.creator) {
            dto.creator = BillParticipantConverter.fromFirestore(data.creator);
        }

        if ('payer' in data && data.payer) {
            dto.payer = BillParticipantConverter.fromFirestore(data.payer);
        }

        return dto;
    },
    toFirestore(modelObject: BillTransaction): DocumentData {
        return {
            id: modelObject.id,
            description: modelObject.description,
            amount: modelObject.amount,
            currency: modelObject.currency,
            splitType: modelObject.splitType,
            date: new Timestamp(modelObject.date.getTime() / 1000, 0),
            creator: modelObject.creator ? BillParticipantConverter.toFirestore(modelObject.creator) : null,
            payer: modelObject.payer ? BillParticipantConverter.toFirestore(modelObject.payer) : null
        }
    }
}
