import {BillTransaction} from "@/models/dtos/Bills/BillTransaction";
import {BillTransactionService} from "@/services/bills/BillTransactionService";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import useLoading from "@/composable/use-loading";

export default function useBillTransactions() {
    const {callAsync} = useLoading();

    const createTransaction = async (billGroup: BillGroup, transaction: BillTransaction) => {
        return await callAsync(BillTransactionService.createNewTransaction, billGroup, transaction)
    }

    return {
        createTransaction
    }
}
