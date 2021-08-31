import { setDoc, addDoc, doc, collection, deleteDoc } from "firebase/firestore";
import {List} from "@/models/dtos/List";
import getDatabaseInstance from "@/db";
import ListConverter from "@/models/converter/ListConverter";

export const ListService = {
    async updateList(list: List) {
        const firebaseReadyData = ListConverter.toFirestore(list)
        return setDoc(doc(getDatabaseInstance(), "lists", list.id), firebaseReadyData , { merge: true})
    },

    async addList(list: List) {
        const data = ListConverter.toFirestore(list);
        return addDoc(collection(getDatabaseInstance(), "lists"), data)
    },

    async deleteList(list: List) {
        return deleteDoc(doc(getDatabaseInstance(), "lists", list.id))
    }
}

export default ListService
