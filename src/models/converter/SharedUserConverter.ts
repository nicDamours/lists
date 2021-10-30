import {DocumentData, FirestoreDataConverter} from "firebase/firestore";
import {SharedUser} from "@/models/dtos/SharedUser";

export const SharedUserConverter: FirestoreDataConverter<SharedUser> = {
    fromFirestore: function(data: any): SharedUser {
        return new SharedUser(data.id, data.email);
    },
    toFirestore: function(modelObject: SharedUser): DocumentData {
        return {
            id: modelObject.id,
        }
    }

}

export default SharedUserConverter;
