import { setDoc, addDoc, doc, collection, deleteDoc } from "firebase/firestore";
import {List} from "@/models/dtos/List";
import ListConverter from "@/models/converter/ListConverter";
import {Container} from "@/utils/Container";
import {FirebaseDatabaseService} from "@/services/FirebaseDatabaseService";

export const ListService = {
    async updateList(list: List) {
        const databaseInstance = Container.get<FirebaseDatabaseService>('FirebaseDatabaseService').db

        const firebaseReadyData = ListConverter.toFirestore(list)
        return setDoc(doc(databaseInstance, "lists", list.id), firebaseReadyData , { merge: true })
    },

    async addList(list: List) {
        const databaseInstance = Container.get<FirebaseDatabaseService>('FirebaseDatabaseService').db

        const data = ListConverter.toFirestore(list);
        return addDoc(collection(databaseInstance, "lists"), data)
    },

    async deleteList(list: List) {
        const databaseInstance = Container.get<FirebaseDatabaseService>('FirebaseDatabaseService').db

        return deleteDoc(doc(databaseInstance, "lists", list.id))
    }
}

export default ListService
