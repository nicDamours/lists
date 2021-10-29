import {Container} from "@/utils/Container";
import {FirebaseFunctionService} from "@/services/FirebaseFunctionService";
import {httpsCallable} from "firebase/functions"
import useLoading from "@/composable/use-loading";

export default function useCloudFunctions() {
    const { callAsync } = useLoading();

    const callFunction = async (functionName: string, payload: any) => {
        const { functions } = Container.get<FirebaseFunctionService>('FirebaseFunctionService');

        const functionCallable = httpsCallable(functions, functionName)

        return callAsync(functionCallable, {text: JSON.stringify(payload)});
    }

    return {
        callFunction
    }
}
