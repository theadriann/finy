// import core
import dayjs from "dayjs";

// import plugins
import Calendar from "dayjs/plugin/calendar";
import UpdateLocale from "dayjs/plugin/updateLocale";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

// use plugins
dayjs.extend(Calendar);
dayjs.extend(UpdateLocale);
dayjs.extend(LocalizedFormat);

// update locale
dayjs.updateLocale("en", {
    calendar: {
        lastDay: "[Yesterday]",
        sameDay: "[Today]",
        nextDay: "[Tomorrow]",
        lastWeek: "[Last] dddd",
        nextWeek: "[Next] dddd",
        sameElse: "LL",
    },
});

// default formats through the whole app
export const DATE_FORMAT = "YYYY-MM-DD";

export default dayjs;
