import {alertController} from "@ionic/vue";

export default async function useConfirm(message: string) {

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        const confirm = await alertController.create({
            header: 'Confirm !',
            message: message,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        return resolve(false);
                    },
                },
                {
                    text: 'Confirm',
                    handler: () => {
                        return resolve(true);
                    },
                },
            ],
        });

        await confirm.present();
    });
}
