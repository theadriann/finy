// models
import Transaction from "../models/Transaction";

// utils
import _ from "lodash";
import dayjs from "@src/utils/dayjs";
import accounting from "accounting";
import { fetchRatesAt } from "./getRates";

export type MoneyConfig = {
    date?: any;
    flow?: "in" | "out";
    amount: number;
    currency: Currency;
};

interface FormatMoneyOptions {
    currency?: string;
}

export type FormattedMoney = {
    sign: "+" | "-";
    signtxt: "plus" | "minus";
    amount: string;
    absoluteAmount: number;
    currency: Currency | string;
    withCurrency: string;
};

export const convertMoney = async (
    amount: string | number,
    from: string,
    to: string,
    date?: string | number
) => {
    // set the date
    if (typeof date === "number") {
        date = dayjs.unix(date).format("YYYY-MM-DD");
    } else {
        date = dayjs(date || undefined).format("YYYY-MM-DD");
    }

    to = _.upperCase(to);
    from = _.upperCase(from);

    // fetch rates & define vars
    let rates = await fetchRatesAt(date);
    let newAmount = Number(amount) * 100;

    // going to eur if not
    if (from !== "EUR") {
        newAmount = newAmount / Number(rates[from]);
    }

    // going to the next currency
    if (to !== "EUR") {
        newAmount = newAmount * Number(rates[to]);
    }

    return (newAmount / 100).toFixed(2);
};

export const resolveTransaction = async (
    transaction: Transaction,
    options: FormatMoneyOptions = {}
) => {
    const newCurrency = options.currency || "RON";
    const newAmount = await convertMoney(
        transaction.amount,
        transaction.currency,
        newCurrency,
        transaction.date
    );

    return {
        sign: transaction.flow === "in" ? "+" : "-",
        signtxt: transaction.flow === "in" ? "plus" : "minus",
        amount: newAmount,
        currency: newCurrency,
        withCurrency: accounting.formatMoney(newAmount, {
            symbol: newCurrency,
        }),
    };
};

export const resolveMoney = async (
    config: MoneyConfig,
    options: FormatMoneyOptions = {}
): Promise<FormattedMoney> => {
    //
    config = _.defaults(config, {
        flow: "out",
        date: dayjs().unix(),
    });

    const amount = config.amount;
    const newCurrency = options.currency || "RON";
    const newAmount = await convertMoney(
        amount,
        config.currency,
        newCurrency,
        config.date
    );

    return {
        sign: config.flow === "in" ? "+" : "-",
        signtxt: config.flow === "in" ? "plus" : "minus",
        amount: newAmount,
        currency: newCurrency,
        absoluteAmount:
            config.flow === "in" ? Number(newAmount) : -Number(newAmount),
        withCurrency: accounting.formatMoney(newAmount, {
            symbol: newCurrency,
        }),
    };
};
