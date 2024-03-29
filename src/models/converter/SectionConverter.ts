import {DocumentData, FirestoreDataConverter} from "firebase/firestore";

import {Section} from "@/models/dtos/Section";
import ItemConverter from "@/models/converter/ItemConverter";
import UUID from "@/utils/UUID";
import {DefaultSection} from "@/models/dtos/DefaultSection";

export const SectionConverter: FirestoreDataConverter<Section> = {
    fromFirestore(data: any): Section {
        let dto;
        if (data.isDefault) {
            dto = new DefaultSection(data.id);
        } else {
            dto = new Section(data.id);
        }

        if (data.name) {
            dto.name = data.name
        }

        if (data.items) {
            dto.items = data.items.map((item: any, index: number) => {
                const itemDTO = ItemConverter.fromFirestore(item);

                if (itemDTO.index === null) {
                    itemDTO.index = index;
                }

                return itemDTO;
            });
        }

        return dto;
    },
    toFirestore(modelObject: Section): DocumentData {
        return {
            id: modelObject.id || UUID.uuidv4(),
            name: modelObject.name,
            isDefault: modelObject.isDefault,
            items: modelObject.items.map(item => ItemConverter.toFirestore(item))
        }
    }

}

export default SectionConverter;
