import {alertController} from "@ionic/vue";
import {useI18n} from "vue-i18n";

export default function useAlert() {
    const { t } = useI18n();
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
                        text: t('global.cancel'),
                        role: 'cancel',
                        handler: () => {
                            return resolve(false);
                        },
                    },
                    {
                        text: t('global.confirm'),
                        handler: (value) => {
                            return resolve(value.input);
                        },
                    },
                ],
            });

            await confirm.present();
        });
    }

    const showInfoAlert = async (message: string, title: string) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            const confirm = await alertController.create({
                header: title,
                message: message,
                buttons: [
                    {
                        text: t('global.ok'),
                        role: 'ok',
                        handler: () => {
                            return resolve(true);
                        },
                    },
                ],
            });

            await confirm.present();
        });
    }

    return {
        showInfoAlert,
        showNumberAlert
    }
}
