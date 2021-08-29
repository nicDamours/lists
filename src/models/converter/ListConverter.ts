import { QueryDocumentSnapshot, FirestoreDataConverter, SnapshotOptions, DocumentData } from "firebase/firestore";
import {List} from "@/models/dtos/List";
import SectionConverter from "@/models/converter/SectionConverter";

export const ListConverter: FirestoreDataConverter<List> = {
    fromFirestore: function(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): List {
        const data = snapshot.data(options);

        const dto = new List(snapshot.id, data.name);

        if(data.sections) {
            dto.sections = data.sections.map((section: any) => SectionConverter.fromFirestore(section))
        }

        return dto;
    },
    toFirestore: function(modelObject: List): DocumentData {
        return {
            id: modelObject.id,
            name: modelObject.name,
            sections: modelObject.sections.map(section => SectionConverter.toFirestore(section))
        }
    }

}

export default ListConverter;
