import useDates from "@/composable/use-dates";
import ShareWeeksRequest from "@/models/dtos/ShareWeeksRequest";
import {Ref} from "vue";
import ShareSingleWeekRequest from "@/models/dtos/ShareSingleWeekRequest";

export default function useShareWeekItems(itemRef: Ref<ShareWeeksRequest>) {
    const {format} = useDates();

    const weekDateFormat = "d MMM yyyy"

    const formatWeekDate = (dateProperty: "startDate" | "endDate") => {
        if (itemRef.value instanceof ShareSingleWeekRequest) {
            const propertyDate = itemRef.value[dateProperty];

            return format(propertyDate, weekDateFormat)
        }

        return "";
    }

    return {
        formatWeekDate
    }
}
