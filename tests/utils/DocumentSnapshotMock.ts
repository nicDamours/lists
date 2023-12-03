import {DocumentData, DocumentSnapshot} from "@firebase/firestore";
import {SnapshotOptions} from "firebase/firestore";
import firebase from "firebase/compat";
import FieldPath = firebase.firestore.FieldPath;

export class DocumentSnapshotMock extends DocumentSnapshot<Record<string, any>> {
    private payload: Record<string, any>

    constructor(payload: Record<string, any>) {
        super();
        this.payload = payload;
    }

    get id(): string {
        return this.payload.id
    }

    exists(): boolean {
        return true;
    }

    get(fieldPath: string | FieldPath, options?: SnapshotOptions): any {
        if (fieldPath instanceof FieldPath) {
            return this.payload
        }

        return this.payload[fieldPath]
    }

    data(options?: SnapshotOptions): Record<string, any> {
        return this.payload as DocumentData;
    }
}
