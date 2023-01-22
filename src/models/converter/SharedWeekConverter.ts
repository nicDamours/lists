import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import {SharedUser} from "@/models/dtos/SharedUser";
import {SharedWeek} from "@/models/dtos/WeekPlan/SharedWeek";
import {weekFactory} from "@/models/converter/WeekConverter";

export const SharedWeekConverter: FirestoreDataConverter<SharedWeek> = {
    fromFirestore: function (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): SharedWeek {
        const data = snapshot.data(options);

        const weekAuthor = new SharedUser(data.user, data.email);

        const week = weekFactory(snapshot.id, data);

        const dto = new SharedWeek(snapshot.id, weekAuthor, week);

        return dto;
    },
    toFirestore: function (modelObject: SharedWeek): DocumentData {
        return {}
    }

}
