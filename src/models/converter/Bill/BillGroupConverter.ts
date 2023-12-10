import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import {BillParticipantConverterPayload} from "@/models/converter/Bill/BillParticipantConverter";


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

        /*
        if (data.participants && false) {
            console.log('payload participants', data.participants);
            for (const participantPayload of data.participants) {
                dto.participants.push(BillParticipantConverter.fromFirestore(participantPayload))
            }
        }
         */

        return dto;

    },
    toFirestore(modelObject: BillGroup): DocumentData {
        const formattedParticipants = modelObject.participants.map(participant => participant.id);

        return {
            name: modelObject.name,
            participants: formattedParticipants
        }
    }
}
