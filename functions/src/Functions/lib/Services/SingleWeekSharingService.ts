import {ISingleWeekSharingService} from "../Interfaces/ISingleWeekSharingService";
import {WeekSharingPayload} from "../Interfaces/WeekSharingPayload";
import {app} from "firebase-admin";
import App = app.App;

/**
 * handle single week sharing operation
 */
export class SingleWeekSharingService implements ISingleWeekSharingService {
  private app: App;

  constructor(app: App) {
    this.app = app;
  }

  createNewSharingRequest(payload: WeekSharingPayload): Promise<boolean> {
    return Promise.resolve(false);
  }

  sharingAlreadyExists(payload: WeekSharingPayload): Promise<boolean> {
    return Promise.resolve(false);
  }

  getExistingSharingError(): string {
    return "You are already sharing this week with this user";
  }
}
