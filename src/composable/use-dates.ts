import * as dateFns from "date-fns";
import useLocale from "@/composable/use-locale";
import useStrings from "@/composable/use-strings";

export default function useDates() {
    const { preferredDateLocale } = useLocale();

    const { capitalize } = useStrings();

    const addDays = (date: Date, days: number) => {
        return dateFns.addDays(date, days)
    }

    const subDays = (date: Date, days: number ) => {
        return dateFns.subDays(date, days);
    }

    const format = (date: Date, format: string) => {
        return dateFns.format(date, format, {
            locale: preferredDateLocale.value
        });
    }

    const parse = (date: string, format: string) => {
        return dateFns.parse(date, format, new Date());
    }

    const dayOfWeekFormat = (date: Date) => format(date, 'EEE');

    const formatDateForDayOfWeek = (date: Date) => {
        return `${capitalize(dayOfWeekFormat(date))} ${format(date, 'dd MMM')}`;
    }

    const getDaysFromDates = (startDate: Date, endDate: Date) => {
        return new Array(Math.abs(dateFns.differenceInDays(startDate, endDate)) + 1).fill(undefined).map((_, index) => {
            const currentDate = addDays(new Date(startDate), index);
            return {
                title: formatDateForDayOfWeek(currentDate),
                date: currentDate
            }
        })
    }


    const getStartOfWeek = (date = new Date()) => {
        return dateFns.startOfWeek(date);
    }

    const getEndOfWeek = (date = new Date()) => {
        return dateFns.endOfWeek(date);
    }

    return {
        format,
        parse,
        subDays,
        addDays,
        getEndOfWeek,
        getStartOfWeek,
        getDaysFromDates,
        formatDateForDayOfWeek,
    }
}
