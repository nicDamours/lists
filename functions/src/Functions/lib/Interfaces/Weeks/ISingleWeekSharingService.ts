import {ISharingService} from "../ISharingService";
import {SharingPayload} from "../SharingPayload";

export type ISingleWeekSharingService<C extends SharingPayload, E extends SharingPayload> = ISharingService<C, E>
