// utils
import React, { useEffect, useState } from "react";
import dayjs from "@src/utils/dayjs";
import classnames from "classnames";
import { FormattedMoney, resolveMoney } from "@src/utils/formatMoney";

type MoneyViewerProps = {
    date?: dayjs.Dayjs | number | string;
    flow?: "in" | "out";
    amount: number;
    currency: Currency;
    newCurrency?: Currency;

    showSign?: boolean;

    className?: string;
};

const MoneyViewer: React.FC<MoneyViewerProps> = ({
    date,
    flow,
    amount,
    currency,
    newCurrency,
    showSign,
    className,
}) => {
    const [money, setMoney] = useState<FormattedMoney>();

    useEffect(() => {
        const updateMoney = async () =>
            setMoney(
                await resolveMoney(
                    { amount, currency, flow, date },
                    { currency: newCurrency || currency }
                )
            );

        updateMoney();
    }, [date, amount, currency, flow, newCurrency]);

    if (!money) {
        return null;
    }

    const renderSign = () =>
        showSign && <span className="sign">{money.sign}</span>;

    return (
        <div
            className={classnames("money", `sign-${money.signtxt}`, className)}
        >
            {renderSign()}
            {money.amount}
            {money.currency}
        </div>
    );
};

MoneyViewer.defaultProps = {
    flow: "out",
    showSign: false,
};

export default MoneyViewer;
