import {
    DocumentData,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    Timestamp
} from "firebase/firestore";
import {WeekPlan} from "@/models/dtos/WeekPlan/WeekPlan";
import WeekDayConverter from "@/models/converter/WeekDayConverter";
import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";
import {SharedUser} from "@/models/dtos/SharedUser";

export const weekFactory = (id: string, data: any) => {
    const dto = new WeekPlan(id, new Date(data.startDate.seconds * 1000), new Date(data.endDate.seconds * 1000));

    if ('user' in data && 'email' in data) {
        dto.author = new SharedUser(data.user, data.email);
    }

    data.days.forEach((day: any) => {
        const givenDay = WeekDayConverter.fromFirestore(day);
        dto.setDay(givenDay, givenDay.date)
    });

    return dto;
}

export const WeekConverter: FirestoreDataConverter<WeekPlan> = {
    fromFirestore: function (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): WeekPlan {
        const data = snapshot.data(options);

        console.log('data', data);

        return weekFactory(snapshot.id, data);
    },
    toFirestore: function (modelObject: WeekPlan): DocumentData {
        const auth = Container.get<FirebaseAuthService>('FirebaseAuthService').auth;

        if(!auth.currentUser) {
            throw new Error("Cannot save week while offline.")
        }

        return {
            id: modelObject.id,
            user: modelObject.author?.id ?? auth.currentUser.uid,
            email: modelObject.author?.email ?? auth.currentUser.email,
            sharingId: modelObject.sharingId,
            startDate: new Timestamp(modelObject.startDate.getTime() / 1000, 0),
            endDate: new Timestamp(modelObject.endDate.getTime() / 1000, 0),
            days: modelObject.days.map(day => WeekDayConverter.toFirestore(day))
        }
    }

}

export default WeekConverter;
