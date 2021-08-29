import {EntityNotFoundException} from "@/Exceptions/EntityNotFoundException";
import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";

export const MUTATION_NAME_ADD = "ADD_RECORD_";
export const MUTATION_NAME_UPDATE = "MUTATE_RECORD_";
export const MUTATION_NAME_DELETE = "SPLICE_RECORD_";


export function firestoreMutations<S extends Record<string, IdentifiableRecord[]>>(property: string) {

    return {
        [MUTATION_NAME_ADD + property.toUpperCase()]: (state: S, payload: any) => {
            state[property].push(payload);
        },
        [MUTATION_NAME_UPDATE + property.toUpperCase()]: (state: S, { value, id }: { value: any; id: string }) => {
            const valueIndex = state[property].findIndex(item => item.id === id);
            if(valueIndex >= 0) {
                state[property][valueIndex] = value;
            } else {
                throw new EntityNotFoundException(property, id);
            }
        },
        [MUTATION_NAME_DELETE + property.toUpperCase()]: (state: S, id: string) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            state[property] = state[property].filter(item => item.id !== id);
        }
    }
}
