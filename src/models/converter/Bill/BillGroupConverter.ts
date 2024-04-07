import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import {
    BillParticipantConverter,
    BillParticipantConverterPayload
} from "@/models/converter/Bill/BillParticipantConverter";
import {
    BillTransactionConverter,
    BillTransactionConverterPayload
} from "@/models/converter/Bill/BillTransactionConverter";


type BillGroupConverterPayload = {
    id: string;
    name: string | null,
    participants: Array<BillParticipantConverterPayload>
    transactions: Array<BillTransactionConverterPayload>

}

export const BillGroupConverter: FirestoreDataConverter<BillGroup> = {
    fromFirestore: function (snapshot: QueryDocumentSnapshot<BillGroupConverterPayload>, options: SnapshotOptions): BillGroup {
        const dto = new BillGroup(snapshot.id);

        const data = snapshot.data();

        dto.name = data.name;

        if (data.participants) {
            for (const participantPayload of Object.values(data.participants)) {
                dto.participants.push(BillParticipantConverter.fromFirestore(participantPayload))
            }
        }

        if (data.transactions) {
            for (const transactionPayload of data.transactions) {
                dto.transactions.push(BillTransactionConverter.fromFirestore(transactionPayload));
            }
        }

        return dto;

    },
    toFirestore(modelObject: BillGroup): DocumentData {
        const formattedParticipants = modelObject.participants.map(participant => BillParticipantConverter.toFirestore(participant));
        const formattedTransactions = modelObject.transactions.map(transaction => BillTransactionConverter.toFirestore(transaction));

        return {
            name: modelObject.name,
            participants: formattedParticipants,
            transactions: formattedTransactions,
        }
    }
}
