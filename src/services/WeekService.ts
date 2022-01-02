import {WeekPlan} from "@/models/dtos/WeekPlan/WeekPlan";
import {Container} from "@/utils/Container";
import {FirebaseDatabaseService} from "@/services/FirebaseDatabaseService";
import {addDoc, collection, doc, setDoc} from "firebase/firestore";
import WeekConverter from "@/models/converter/WeekConverter";

export const WeekService = {
    async updateWeek(week: WeekPlan) {
        const databaseInstance = Container.get<FirebaseDatabaseService>('FirebaseDatabaseService').db

        const firebaseReadyData = WeekConverter.toFirestore(week)
        return setDoc(doc(databaseInstance, "weeks", week.id), firebaseReadyData , { merge: true })
    },
    async createWeek(week: WeekPlan) {
        const databaseInstance = Container.get<FirebaseDatabaseService>('FirebaseDatabaseService').db

        const data = WeekConverter.toFirestore(week);
        return addDoc(collection(databaseInstance, "weeks"), data)
    }
}
