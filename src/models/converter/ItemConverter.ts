import {DocumentData, FirestoreDataConverter} from "firebase/firestore";

import {Item} from "@/models/dtos/Item";
import UUID from "@/utils/UUID";

export const ItemConverter: FirestoreDataConverter<Item> = {
    fromFirestore(data: any): Item {
        const dto = new Item(data.id, data.name);

        if (data.done) {
            dto.done = data.done
        }

        if (data.quantity) {
            dto.quantity = data.quantity
        }

        return dto;
    },
    toFirestore(modelObject: Item): DocumentData {
        return {
            id: modelObject.id || UUID.uuidv4(),
            name: modelObject.name,
            done: modelObject.done,
            quantity: modelObject.quantity
        }
    }

}

export default ItemConverter;
