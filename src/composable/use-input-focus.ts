import { Ref } from "vue";

export default function useInputFocus(refs: Ref<Readonly<Record<string, any>>>) {
    const defineInputFocus = async (id: string, state: boolean) => {
        return new Promise(resolve => {
            setTimeout(async () => {
                const targetRef = refs.value[id];

                if(targetRef) {
                    await targetRef.$el.setFocus(state);
                }

                resolve(true);
            }, 100);
        })

    }

    return {
        defineInputFocus
    }
}
