import {DocumentData, FirestoreDataConverter, Timestamp} from "firebase/firestore";
import UUID from "@/utils/UUID";
import {WeekPlanDays} from "@/models/dtos/WeekPlan/WeekPlanDays";

export const WeekDayConverter: FirestoreDataConverter<WeekPlanDays> = {
    fromFirestore(data: any): WeekPlanDays {
        return new WeekPlanDays(data.id, data.dinner, data.supper, data.activities, new Date(data.date.seconds * 1000));
    },
    toFirestore(modelObject: WeekPlanDays): DocumentData {
        return {
            id: modelObject.id || UUID.uuidv4(),
            dinner: modelObject.dinner,
            supper: modelObject.supper,
            activities: modelObject.activities,
            date: new Timestamp(modelObject.date.getTime() / 1000, 0)
        }
    }

}

export default WeekDayConverter;
