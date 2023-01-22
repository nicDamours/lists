import {ISharingService} from "../ISharingService";
import {SharingPayload} from "../SharingPayload";

export type IListServiceSharing<C extends SharingPayload, E extends SharingPayload> = ISharingService<C, E>
