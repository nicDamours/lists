import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import {
    BillParticipantConverter,
    BillParticipantConverterPayload
} from "@/models/converter/Bill/BillParticipantConverter";


type BillGroupConverterPayload = {
    id: string;
    name: string | null,
    participants: Array<BillParticipantConverterPayload>

}

export const BillGroupConverter: FirestoreDataConverter<BillGroup> = {
    fromFirestore: function (snapshot: QueryDocumentSnapshot<BillGroupConverterPayload>, options: SnapshotOptions): BillGroup {
        const dto = new BillGroup(snapshot.id);

        const data = snapshot.data();

        dto.name = data.name;

        if (data.participants) {
            for (const participantPayload of data.participants) {
                dto.participants.push(BillParticipantConverter.fromFirestore(participantPayload))
            }
        }

        return dto;

    },
    toFirestore(modelObject: BillGroup): DocumentData {
        return {
            id: modelObject.id,
            name: modelObject.name
        }
    }
}
