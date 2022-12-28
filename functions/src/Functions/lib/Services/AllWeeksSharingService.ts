import {IAllWeeksSharingService} from "../Interfaces/IAllWeeksSharingService";
import {WeekSharingPayload} from "../Interfaces/WeekSharingPayload";
import {app} from "firebase-admin";
import App = app.App;

export class AllWeeksSharingService implements IAllWeeksSharingService {
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
        return "You are already sharing all week with this user";
    }
}
