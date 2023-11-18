import {Section} from "@/models/dtos/Section";

export class DefaultSection extends Section {

    get name(): string {
        return "default";
    }

    set name(value: string) {
        return;
    }


    get isDefault(): boolean {
        return true;
    }
}
