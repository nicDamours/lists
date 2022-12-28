import {Container} from "./Utils/Container";
import {SingleWeekSharingService} from "./Services/SingleWeekSharingService";

/**
 * Create necessary binding for dependency injection
 */
export default function (): void {
  Container.getInstance().registerClasses({
    ISingleWeekSharingService: SingleWeekSharingService,
  });
}
