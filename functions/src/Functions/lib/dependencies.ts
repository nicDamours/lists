import {Container} from "./Utils/Container";
import {SingleWeekSharingService} from "./Services/SingleWeekSharingService";
import {AllWeeksSharingService} from "./Services/AllWeeksSharingService";
import {ListSharingService} from "./Services/ListSharingService";

/**
 * Create necessary binding for dependency injection
 */
export default function (): void {
    Container.getInstance().registerClasses({
        ISingleWeekSharingService: SingleWeekSharingService,
        IAllWeeksSharingService: AllWeeksSharingService,
        IListServiceSharing: ListSharingService,
    });
}
