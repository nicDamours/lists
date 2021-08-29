import { setDoc, addDoc, doc, collection, deleteDoc } from "firebase/firestore";
import {List} from "@/models/dtos/List";
import { db } from "@/db";
import ListConverter from "@/models/converter/ListConverter";

export const ListService = {
    async updateList(list: List) {
        const firebaseReadyData = ListConverter.toFirestore(list)
        return setDoc(doc(db, "lists", list.id), firebaseReadyData , { merge: true})
    },

    async addList(list: List) {
        return addDoc(collection(db, "lists"), ListConverter.toFirestore(list))
    },

    async deleteList(list: List) {
        return deleteDoc(doc(db, "lists", list.id))
    }
}

export default ListService
