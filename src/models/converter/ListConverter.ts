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
            dto.sharedWiths = Object.keys(data.sharedWith).map((key: any) => SharedUserConverter.fromFirestore({
                id: key,
                email: data.sharedWith[key]
            } as any))
        }

        if(data.user) {
            dto.originalAuthor = data.user

            if(data.userEmail) {
                dto.originalAuthorEmail = data.userEmail;
            }

            if(auth.currentUser) {
                dto.isSharedWithCurrentUser = auth.currentUser.uid !== dto.originalAuthor;
            }
        }

        return dto;
    },
    toFirestore: function(modelObject: List): DocumentData {
        const auth = Container.get<FirebaseAuthService>('FirebaseAuthService').auth;

        const values: Record<string, any> = {
            id: modelObject.id,
            name: modelObject.name,
            user: modelObject.originalAuthor,
            sections: modelObject.sections.map(section => SectionConverter.toFirestore(section))
        }

        if(auth.currentUser && modelObject.originalAuthor === auth.currentUser.uid) {
            values.userEmail = auth.currentUser.email;
        }

        return values;
    }

}

export default ListConverter;
