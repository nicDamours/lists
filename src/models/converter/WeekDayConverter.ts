import {DocumentData, FirestoreDataConverter, Timestamp} from "firebase/firestore";
import UUID from "@/utils/UUID";
import {WeekPlanDays} from "@/models/dtos/WeekPlan/WeekPlanDays";
import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";
import {SharedUser} from "@/models/dtos/SharedUser";

export const WeekDayConverter: FirestoreDataConverter<WeekPlanDays> = {
    fromFirestore(data: any): WeekPlanDays {
        const dto = new WeekPlanDays(data.id, data.dinner, data.supper, data.activities, new Date(data.date.seconds * 1000));

        if ('authorId' in data && 'authorEmail' in data) {
            dto.author = new SharedUser(data.authorId, data.authorEmail)
        }

        return dto;
    },
    toFirestore(modelObject: WeekPlanDays): DocumentData {
        const auth = Container.get<FirebaseAuthService>('FirebaseAuthService').auth;

        if (!auth.currentUser) {
            throw new Error("Cannot save week while offline.")
        }


        return {
            id: modelObject.id || UUID.uuidv4(),
            dinner: modelObject.dinner,
            supper: modelObject.supper,
            activities: modelObject.activities,
            authorId: modelObject.author?.id ?? auth.currentUser.uid,
            authorEmail: modelObject.author?.email ?? auth.currentUser.email,
            date: new Timestamp(modelObject.date.getTime() / 1000, 0)
        }
    }

}

export default WeekDayConverter;
