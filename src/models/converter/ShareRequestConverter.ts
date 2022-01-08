import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import ShareRequest from "@/models/dtos/ShareRequest";
import firebase from "firebase/compat";
import DocumentData = firebase.firestore.DocumentData;
import {FirebaseAuthService} from "@/services/FirebaseAuthService";
import {Container} from "@/utils/Container";

export const ShareRequestConverter: FirestoreDataConverter<ShareRequest> = {
    fromFirestore: function (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ShareRequest {
        const { auth } = Container.get<FirebaseAuthService>('FirebaseAuthService');
        const data = snapshot.data(options);

        const dto = new ShareRequest(snapshot.id, data.targetId, data.targetEmail, data.authorEmail, data.authorId, data.listId, data.listName);

        if(auth.currentUser) {
            dto.isCurrentUserTheAuthor = data.authorId === auth.currentUser.uid;
        }

        return dto;
    },
    toFirestore: function (): DocumentData {
        return {}
    }
}
