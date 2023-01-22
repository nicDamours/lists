import {computed, ref} from "vue";
import WeekPicker from "../../../components/week/WeekPicker.vue";
import useDates from "../../../composable/use-dates";

export default {
    component: WeekPicker,
    title: "WeekPicker",
};

const Template = () => ({
    components: {WeekPicker},
    template: `
      <WeekPicker v-model="modelValue"/>
    `,
    setup() {
        const currentDate = ref(new Date())

        const {getStartOfWeek, getEndOfWeek} = useDates();

        const modelValue = computed({
            get() {
                return {
                    startDate: getStartOfWeek(currentDate.value),
                    endDate: getEndOfWeek(currentDate.value)
                };
            },
            set(value) {
                currentDate.value = value.startDate;
            }
        })

        return {
            modelValue
        };
    }
});

export const defaultWeekPicker = Template.bind({});
