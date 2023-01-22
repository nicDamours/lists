import * as dateFns from "date-fns";
import {Interval} from "date-fns";
import useLocale from "@/composable/use-locale";
import useStrings from "@/composable/use-strings";

export default function useDates() {
    const getDateFormat = () => 'yyyy-MM-dd';

    const {preferredDateLocale} = useLocale();

    const {capitalize} = useStrings();

    const addDays = (date: Date, days: number) => {
        return dateFns.addDays(date, days)
    }

    const subDays = (date: Date, days: number) => {
        return dateFns.subDays(date, days);
    }

    const format = (date: Date, format: string) => {
        return dateFns.format(date, format, {
            locale: preferredDateLocale.value
        })
    }

    const parse = (date: string, format: string) => {
        return dateFns.parse(date, format, new Date());
    }

    const dayOfWeekFormat = (date: Date) => format(date, 'EEE');

    const formatDateForDayOfWeek = (date: Date) => {
        return `${capitalize(dayOfWeekFormat(date))} ${format(date, 'dd MMM')}`
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

    const toISO = (date = new Date()) => {
        return dateFns.formatISO(date);
    }

    const parseISO = (dateString: string) => {
        return dateFns.parseISO(dateString)
    }

    const isSameDay = (firstDate: Date, secondDate: Date) => {
        return dateFns.format(firstDate, getDateFormat()) === dateFns.format(secondDate, getDateFormat());
    }

    const getWeek = (date: Date) => {
        return dateFns.getWeek(date);
    }

    const startOfWeek = (date: Date) => {
        return dateFns.startOfWeek(date);
    }

    const endOfWeek = (date: Date) => {
        return dateFns.endOfWeek(date);
    }

    const eachDayOfInterval = (interval: Interval) => {
        return dateFns.eachDayOfInterval(interval);
    }

    const getDatesInWeek = (date: Date) => {
        const firstDayOfWeek = startOfWeek(date);
        const lastDayOfWeek = endOfWeek(date)

        return eachDayOfInterval({start: firstDayOfWeek, end: lastDayOfWeek});
    }

    return {
        parse,
        toISO,
        format,
        getWeek,
        subDays,
        addDays,
        parseISO,
        endOfWeek,
        isSameDay,
        startOfWeek,
        getEndOfWeek,
        getDateFormat,
        getDatesInWeek,
        getStartOfWeek,
        getDaysFromDates,
        formatDateForDayOfWeek,
    }
}
