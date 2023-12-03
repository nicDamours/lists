import {
    DocumentData,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    Timestamp
} from "firebase/firestore";
import {Bill} from "@/models/dtos/Bills/Bill";
import {
    BillParticipantConverter,
    BillParticipantConverterPayload
} from "@/models/converter/Bill/BillParticipantConverter";
import {BillSplitType} from "@/models/enums/BillSplitType";

export type BillConverterPayload = {
    id: string,
    date: Timestamp,

    description: string,

    amount: number,

    currency: string,

    payer: BillParticipantConverterPayload,

    creator: BillParticipantConverterPayload,

    splitType: string
}

export const BillConverter: FirestoreDataConverter<Bill> = {
    fromFirestore(snapshot: QueryDocumentSnapshot<BillConverterPayload>, options?: SnapshotOptions): Bill {
        const data = snapshot.data();

        const dto = new Bill(snapshot.id);

        dto.description = data.description;

        dto.amount = data.amount
        dto.currency = data.currency;

        if ('date' in data && data.date) {
            dto.date = data.date.toDate()
        }

        switch (data.splitType) {
            case BillSplitType.EQUALS:
                dto.splitType = BillSplitType.EQUALS;
                break;
            case BillSplitType.FULLY_OWN:
                dto.splitType = BillSplitType.FULLY_OWN;
                break;
            default:
                dto.splitType = BillSplitType.EQUALS;
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
    toFirestore(modelObject: Bill): DocumentData {
        return {
            id: modelObject.id,
            description: modelObject.description,
            amount: modelObject.amount,
            currency: modelObject.currency,
            splitType: modelObject.splitType,
            date: new Timestamp(modelObject.date.getTime() / 1000, 0),
            creator: modelObject.creator?.id,
            payer: modelObject.payer?.id
        }
    }
}
