import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import {WeekPlan} from "@/models/dtos/WeekPlan/WeekPlan";
import WeekDayConverter from "@/models/converter/WeekDayConverter";
import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export const WeekConverter: FirestoreDataConverter<WeekPlan> = {
    fromFirestore: function(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): WeekPlan {
        const data = snapshot.data(options);

        const dto = new WeekPlan(snapshot.id, new Date(data.startDate.seconds * 1000), new Date(data.endDate.seconds * 1000));

        data.days.forEach((day: any) => {
            const givenDay =  WeekDayConverter.fromFirestore(day);
            dto.setDay(givenDay, givenDay.date)
        });

        return dto;
    },
    toFirestore: function(modelObject: WeekPlan): DocumentData {
        const auth = Container.get<FirebaseAuthService>('FirebaseAuthService').auth;

        if(!auth.currentUser) {
            throw new Error("Cannot save week while offline.")
        }

        return {
            id: modelObject.id,
            user: auth.currentUser.uid,
            startDate: new Timestamp(modelObject.startDate.getTime() / 1000 , 0),
            endDate: new Timestamp(modelObject.endDate.getTime() / 1000 , 0),
            days: modelObject.days.map(day => WeekDayConverter.toFirestore(day))
        }
    }

}

export default WeekConverter;
