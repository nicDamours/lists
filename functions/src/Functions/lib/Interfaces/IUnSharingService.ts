import {SharingPayload} from "./SharingPayload";

export interface IUnSharingService<T extends SharingPayload> {

    revokeShareRequest(payload: T, currentUserId: string): Promise<void>;

    assertUnShareRequestPayloadIsValid(payload: T, currentUserId: string): Promise<void>
}
