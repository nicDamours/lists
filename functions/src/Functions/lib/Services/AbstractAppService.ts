import {app} from "firebase-admin";
import App = app.App;

export class AbstractAppService {
    protected app: App;

    constructor(app: App) {
        this.app = app;
    }
}
