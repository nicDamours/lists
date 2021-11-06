import { createWorker } from 'tesseract.js';
import useLoading from "@/composable/use-loading";

export default function useTesseract() {
    const { defineLoadingProgress } = useLoading();

    const worker = createWorker({
        logger: async m => {
            if(m.status === 'recognizing text') {
                await defineLoadingProgress(m.progress);
            }
        }
    });

    const trimOutQuantities = (part: string) => {
        const regexp = new RegExp(/^((\w+)(\s)?(g|ml|kg|c|l(b?)|t(bl|bsp|b|sp)?|pt|oz)+?)\s/gmi)
        return part.replaceAll(regexp, "");
    }

    const trimText = (text: string): string[] => {
        return text.split('\n')
            // remove empty lines
            .filter((item: string) => !!item)
            // remove measurements from lines
            .map(trimOutQuantities);
    }

    const imageToText = async (lang: string, imageUrl: string): Promise<string[]> => {
        await defineLoadingProgress(null)

        await worker.load();
        await worker.loadLanguage(lang);
        await worker.initialize(lang);
        const { data: { text } } = await worker.recognize(imageUrl);
        await worker.terminate();

        return trimText(text);
    }

    return {
        imageToText
    }
}
