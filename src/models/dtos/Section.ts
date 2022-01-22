import {ClonableItem} from "@/models/dtos/Item";
import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";

export class Section implements IdentifiableRecord{
    private _id: string;
    private _name = "";

    private _items: ClonableItem[] = [];

    constructor(id: string) {
        this._id = id;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get items(): ClonableItem[] {
        return this._items;
    }

    set items(value: ClonableItem[]) {
        this._items = value;
    }


    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id;
    }

    removeItem(index: number) {
        this.items.splice(index, 1);
    }

    insertItem(item: ClonableItem, index: number = this.items.length) {
        this.items.splice(index, 0, item);
        this._updateItemsIndexes();
    }

    _updateItemsIndexes() {
        this.items.forEach((item, index) => {
            this.items[index].index = index;
        });
    }
}
