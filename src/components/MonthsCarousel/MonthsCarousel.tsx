// utils
import React from "react";
import dayjs from "@src/utils/dayjs";
import classnames from "classnames";
import { useState, useEffect } from "react";

import styles from "./MonthsCarousel.module.scss";

const MonthsCarousel: React.FC<{
    endDate: dayjs.Dayjs;
    startDate: dayjs.Dayjs;

    selectedDate?: dayjs.Dayjs;
    onDateChange?: Function;
}> = ({ startDate, endDate, selectedDate, onDateChange }) => {
    const [dates, setDates] = useState<dayjs.Dayjs[]>([]);

    // fix bad arguments -- wink wink
    if (endDate.isBefore(startDate)) {
        let aux = startDate;

        startDate = endDate;
        endDate = aux;
    }

    useEffect(() => {
        let monthsDiff = endDate.diff(startDate, "month");
        const datesDiff = [];

        // bug
        if (!monthsDiff && !startDate.isSame(endDate, "month")) {
            monthsDiff++;
        }

        for (let i = 0; i <= monthsDiff; i++) {
            const someDate = endDate.subtract(i, "month");

            datesDiff.push(someDate);
        }

        setDates(datesDiff);
    }, [startDate, endDate]);

    const onDateClick = (month: dayjs.Dayjs) => {
        onDateChange && onDateChange(month);
    };

    const renderMonth = (month: dayjs.Dayjs) => {
        const sameYear = month.get("year") === dayjs().get("year");
        let label = sameYear
            ? month.format("MMMM")
            : `${month.format("MMMM")} ${month.format("YYYY")}`;

        let active = false;

        if (selectedDate) {
            active =
                month.isSame(selectedDate, "year") &&
                month.isSame(selectedDate, "month");
        }

        return (
            <div
                key={month.unix()}
                className={classnames(styles.month, { active })}
                onClick={() => onDateClick(month)}
            >
                {label}
            </div>
        );
    };

    const renderMonths = () => {
        return dates.map(renderMonth);
    };

    return <div className={styles.container}>{renderMonths()}</div>;
};

export default MonthsCarousel;
