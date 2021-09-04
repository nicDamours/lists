import {alertController} from "@ionic/vue";
import {useI18n} from "vue-i18n";

export default function useConfirm() {
    const { t } = useI18n();

    const showConfirm = async (message: string) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            const confirm = await alertController.create({
                header: t('global.confirmHeader'),
                message: message,
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
        showConfirm
    }
}
