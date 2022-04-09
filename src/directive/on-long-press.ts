import {ref, Ref} from "vue";

const OnLongPress = {
    mounted(el: HTMLElement, binding: {value: CallableFunction}) {
        const LONG_PRESS_TIMEOUT = 500;

        const currentTimeout: Ref<number|null> = ref(null);

        const tapStartHandler = () => {
            if(currentTimeout.value === null) {
                currentTimeout.value = setTimeout(() => {
                    currentTimeout.value = null;
                    binding.value()
                }, LONG_PRESS_TIMEOUT)
            }
        };

        const tapEndHandler = () => {
            if(currentTimeout.value !== null) {
                clearTimeout(currentTimeout.value);
                currentTimeout.value = null;
            }
        }
        el.addEventListener('touchstart', tapStartHandler);
        el.addEventListener('mousedown', tapStartHandler);

        el.addEventListener('touchend', tapEndHandler);
        el.addEventListener('touchmove', tapEndHandler)
        el.addEventListener('mouseup', tapEndHandler);
    }
}

export default OnLongPress;
