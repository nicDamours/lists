import * as dateFns from "date-fns";
import useLocale from "@/composable/use-locale";
import useStrings from "@/composable/use-strings";
import {computed} from "vue";

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
        return computed(() => {
            return dateFns.format(date, format, {
                locale: preferredDateLocale.value
            })
        });
    }

    const parse = (date: string, format: string) => {
        return dateFns.parse(date, format, new Date());
    }

    const dayOfWeekFormat = (date: Date) => format(date, 'EEE');

    const formatDateForDayOfWeek = (date: Date) => {
        return computed(() => `${capitalize(dayOfWeekFormat(date).value)} ${format(date, 'dd MMM').value}`);
    }

    const getDaysFromDates = (startDate: Date, endDate: Date) => {
        return computed(() => new Array(Math.abs(dateFns.differenceInDays(startDate, endDate)) + 1).fill(undefined).map((_, index) => {
            const currentDate = addDays(new Date(startDate), index);
            return {
                title: formatDateForDayOfWeek(currentDate).value,
                date: currentDate
            }
        }));
    }


    const getStartOfWeek = (date = new Date()) => {
        return dateFns.startOfWeek(date);
    }

    const getEndOfWeek = (date = new Date()) => {
        return dateFns.endOfWeek(date);
    }

    const toISO = (date = new Date()) => {
        return dateFns.formatISO(date);
    }

    const parseISO = (dateString: string) => {
        return dateFns.parseISO(dateString)
    }

    const isSameDay = (firstDate: Date, secondDate: Date) => {
        return dateFns.format(firstDate, 'yyyy-MM-dd') === dateFns.format(secondDate, 'yyyy-MM-dd');
    }

    return {
        parse,
        toISO,
        format,
        subDays,
        addDays,
        parseISO,
        isSameDay,
        getEndOfWeek,
        getStartOfWeek,
        getDaysFromDates,
        formatDateForDayOfWeek,
    }
}
