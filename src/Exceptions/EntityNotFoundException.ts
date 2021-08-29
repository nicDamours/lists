export class EntityNotFoundException extends Error {

    constructor(type: string, id: string) {
        super(`could not find entity of type ${type} with id ${id}`);
    }
}
