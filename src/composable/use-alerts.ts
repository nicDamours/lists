import {alertController} from "@ionic/vue";

export default function useAlert() {
    const showNumberAlert = async (message: string, value = 1, title = "") => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            const confirm = await alertController.create({
                header: title,
                message: message,
                inputs: [
                    {
                        name: 'input',
                        type: 'number',
                        value,
                        min: '1',
                        max: '100',
                    },
                ],
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
                        handler: (value) => {
                            return resolve(value.input);
                        },
                    },
                ],
            });

            await confirm.present();
        });
    }

    return {
        showNumberAlert
    }
}
