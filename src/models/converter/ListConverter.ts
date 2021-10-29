import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import {List} from "@/models/dtos/List";
import SectionConverter from "@/models/converter/SectionConverter";
import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";
import SharedUserConverter from "@/models/converter/SharedUserConverter";

export const ListConverter: FirestoreDataConverter<List> = {
    fromFirestore: function(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): List {
        const auth = Container.get<FirebaseAuthService>('FirebaseAuthService').auth;
        const data = snapshot.data(options);

        const dto = new List(snapshot.id, data.name);

        if(data.sections) {
            dto.sections = data.sections.map((section: any) => SectionConverter.fromFirestore(section))
        }

        if(data.sharedWith) {
            dto.sharedWiths = data.sharedWith.map((user: any) => SectionConverter.fromFirestore(user))
        }

        if(data.user) {
            dto.originalAuthor = data.user

            if(auth.currentUser) {
                dto.isSharedWithCurrentUser = auth.currentUser.uid !== dto.originalAuthor;
            }
        }

        return dto;
    },
    toFirestore: function(modelObject: List): DocumentData {
        const auth = Container.get<FirebaseAuthService>('FirebaseAuthService').auth;

        return {
            id: modelObject.id,
            name: modelObject.name,
            user: modelObject.originalAuthor,
            sections: modelObject.sections.map(section => SectionConverter.toFirestore(section))
        }
    }

}

export default ListConverter;
