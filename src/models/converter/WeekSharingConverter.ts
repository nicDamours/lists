import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import {SharedUser} from "@/models/dtos/SharedUser";
import {WeekSharing} from "@/models/dtos/WeekSharing";

export const WeekSharingConverter: FirestoreDataConverter<WeekSharing> = {
    fromFirestore: function (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): WeekSharing {
        const data = snapshot.data(options);

        const weekTarget = new SharedUser(data.targetId, data.targetEmail);
        const weekAuthor = new SharedUser(data.authorId, data.authorEmail);

        const dto = new WeekSharing(snapshot.id, weekAuthor, weekTarget);

        return dto;
    },
    toFirestore: function (modelObject: WeekSharing): DocumentData {
        return {}
    }

}
