import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import {SharedUser} from "@/models/dtos/SharedUser";
import {WeekSharing} from "@/models/dtos/WeekPlan/WeekSharing";
import {weekFactory} from "@/models/converter/WeekConverter";

export const WeekSharingConverter: FirestoreDataConverter<WeekSharing> = {
    fromFirestore: function (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): WeekSharing {
        const data = snapshot.data(options);

        const weekAuthor = new SharedUser(data.user, data.email);

        const week = weekFactory(snapshot.id, data);

        const dto = new WeekSharing(snapshot.id, weekAuthor, week);

        return dto;
    },
    toFirestore: function (modelObject: WeekSharing): DocumentData {
        return {}
    }

}
