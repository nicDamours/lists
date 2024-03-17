import {BillParticipantBalance} from "@/models/dtos/Bills/BillParticipantBalance";

const BillUtils = {
    getAmountForBalances(balances: Array<BillParticipantBalance>): number {
        if (!balances) {
            return 0;
        }

        return balances.map(item => item.amount)
            .reduce((col, item) => col += item, 0);
    }
}

export default BillUtils
