import { QueryDocumentSnapshot, FirestoreDataConverter, SnapshotOptions, DocumentData } from "firebase/firestore";
import {List} from "@/models/dtos/List";
import SectionConverter from "@/models/converter/SectionConverter";
import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";

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
        const auth = Container.get<FirebaseAuthService>('FirebaseAuthService').auth;

        const user = auth.currentUser;

        return {
            id: modelObject.id,
            name: modelObject.name,
            user: user ? user.uid : null,
            sections: modelObject.sections.map(section => SectionConverter.toFirestore(section))
        }
    }

}

export default ListConverter;
