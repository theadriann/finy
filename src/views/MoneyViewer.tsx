// utils
import React, { useEffect, useState } from "react";
import dayjs from "@src/utils/dayjs";
import classnames from "classnames";
import { ResolvedMoney, resolveMoney } from "@src/utils/money";

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
    const [money, setMoney] = useState<ResolvedMoney>();

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
        showSign && <span className="sign">{money.signChar}</span>;

    return (
        <div
            className={classnames("money", `sign-${money.signText}`, className)}
        >
            {renderSign()}
            {money.amount}
            <span>&nbsp;</span>
            {money.symbol}
        </div>
    );
};

MoneyViewer.defaultProps = {
    flow: "out",
    showSign: false,
};

export default MoneyViewer;
