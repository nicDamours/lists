import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import {SharedUser} from "@/models/dtos/SharedUser";
import {WeekSharing} from "@/models/dtos/WeekPlan/WeekSharing";
import {weekFactory} from "@/models/converter/WeekConverter";

export const WeekSharingConverter: FirestoreDataConverter<WeekSharing> = {
    fromFirestore: function (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): WeekSharing {
        const data = snapshot.data(options);

        const weeks = data.weeks.map(async (weekDocumentReference: Promise<any>) => {
            const weekData = await weekDocumentReference.get();

            return weekFactory(weekData.id, weekData)
        })

        const weekAuthor = new SharedUser(data.authorId, data.authorEmail);

        const dto = new WeekSharing(snapshot.id, weekAuthor, weeks);

        return dto;
    },
    toFirestore: function (modelObject: WeekSharing): DocumentData {
        return {}
    }

}
