import {Item} from "@/models/dtos/Item";
import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";

export class Section implements IdentifiableRecord{
    private _id: string;
    private _name = "";

    private _items: Item[] = [];

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

    get items(): Item[] {
        return this._items;
    }

    set items(value: Item[]) {
        this._items = value;
    }


    isEqual(other: IdentifiableRecord): boolean {
        return this.id === other.id;
    }

    removeItem(index: number) {
        this.items.splice(index, 1);
    }

    insertItem(item: Item, index: number = this.items.length) {
        this.items.splice(index, 0, item);
        this._updateItemsIndexes();
    }

    _updateItemsIndexes() {
        this.items.forEach((item, index) => {
            item.index = index;
        })
    }
}
