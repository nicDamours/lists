import {toastController} from "@ionic/vue";

export default function useToast() {

    const showToast = async (color: string, text: string) => {
        const toast = await toastController
            .create({
                message: text,
                color,
                duration: 2000
            })
        return toast.present();
    }

    const successToast = async (text: string) => {
        return showToast('success', text);
    }

    const dangerToast = async (text: string) => {
        return showToast('danger', text);
    }

    const warningToast = async (text: string) => {
        return showToast('warning', text);
    }

    const infoToast = async (text: string) => {
        return showToast('info', text);
    }


    return {
        showToast,
        successToast,
        dangerToast,
        warningToast,
        infoToast
    }
}
