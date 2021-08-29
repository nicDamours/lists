import firebase from "firebase/compat";
import DocumentData = firebase.firestore.DocumentData;

export interface IdentifiableRecord extends DocumentData{
    id: string;

    isEqual(other: IdentifiableRecord): boolean;
}
