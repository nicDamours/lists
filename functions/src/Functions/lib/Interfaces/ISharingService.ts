import {firestore} from "firebase-admin";
import {SharingPayload} from "./SharingPayload";
import DocumentReference = firestore.DocumentReference;


/**
 * @param C The payload used then creating a new share request
 * @param E The payload used when editing a share request
 */
export interface ISharingService<T extends SharingPayload, C extends SharingPayload> {

    assertShareRequestPayloadIsValid(payload: T, currentUserId: string): Promise<void>

    createNewSharingRequest(payload: T, currentUserId: string): Promise<DocumentReference<unknown>>

    assertShareRequestIsValid(payload: C, currentUserId: string): Promise<void>;

    applyNewShare(payload: C, currentUserId: string): Promise<string>
}
