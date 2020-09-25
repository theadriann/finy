// models
import Transaction from "../models/Transaction";

// utils
import _ from "lodash";
import dayjs, { DATE_FORMAT } from "@src/utils/dayjs";
import currency from "currency.js";
import accounting from "accounting";
import { fetchRatesAt } from "./getRates";

export type MoneyConfig = {
    date?: any;
    flow?: "in" | "out";
    amount: number;
    currency: Currency;
};

interface FormatMoneyOptions {
    currency?: Currency;
}

export type ResolvedMoney = {
    sign: number;
    signChar: "+" | "-";
    signText: "plus" | "minus";

    isPositive: boolean;
    isNegative: boolean;

    amount: number;
    symbol: string;
    currency: Currency;

    formatted: string;
    signedAmount: number;
};

// -----------------------
// basic function for
// convering curencies
// -----------------------

type ConvertCurrencyParams = {
    to: string;
    from: string;
    date?: string | number;
    amount: string | number;
};

export const currencyToSymbol = (curr: Currency) => {
    switch (curr) {
        case "RON":
            return "RON";

        case "EUR":
            return "€";

        case "USD":
            return "$";
    }
};

export const withCurrency = (curr: Currency) => {
    switch (curr) {
        case "RON":
            return (value: number) => currency(value, { symbol: "RON" });

        case "EUR":
            return (value: number) => currency(value, { symbol: "€" });

        case "USD":
            return (value: number) => currency(value);
    }
};

export const convertCurrency = async ({
    to,
    from,
    date,
    amount,
}: ConvertCurrencyParams): Promise<number> => {
    // find the the date
    if (typeof date === "number") {
        date = dayjs.unix(date).format(DATE_FORMAT);
    } else {
        date = dayjs(date || undefined).format(DATE_FORMAT);
    }

    // resolve currencies
    to = _.upperCase(to);
    from = _.upperCase(from);

    // fetch rates & define vars
    let rates = await fetchRatesAt(date);
    let newAmount = currency(amount).multiply(100);

    // going to eur if not
    if (from !== "EUR") {
        newAmount = newAmount.divide(Number(rates[from]));
    }

    // going to the next currency
    if (to !== "EUR") {
        newAmount = newAmount.multiply(Number(rates[to]));
    }

    return newAmount.divide(100).value;
};

export const resolveTransaction = async (
    transaction: Transaction,
    options: FormatMoneyOptions = {}
) => {
    const newCurrency = options.currency || "RON";

    return await resolveMoney(
        {
            date: transaction.date,
            flow: transaction.flow,
            amount: transaction.amount,
            currency: transaction.currency,
        },
        { currency: newCurrency }
    );
};

export const resolveMoney = async (
    config: MoneyConfig,
    options: FormatMoneyOptions = {}
): Promise<ResolvedMoney> => {
    //
    config = _.defaults(config, {
        flow: "out",
        date: dayjs().unix(),
    });

    const amount = config.amount;
    const newCurrency = options.currency || "RON";

    let newAmount: any = amount;

    if (newCurrency !== config.currency) {
        newAmount = await convertCurrency({
            amount,
            from: config.currency,
            to: newCurrency,
            date: config.date,
        });
    }

    const isInflow = config.flow === "in";
    const signedAmount = isInflow ? newAmount : -newAmount;

    return {
        sign: Math.sign(signedAmount),
        signChar: isInflow ? "+" : "-",
        signText: isInflow ? "plus" : "minus",

        amount: newAmount,
        symbol: currencyToSymbol(newCurrency),
        currency: newCurrency,
        signedAmount,

        isPositive: signedAmount >= 0,
        isNegative: signedAmount < 0,

        // formatted: accounting.formatMoney(newAmount, {
        //     symbol: newCurrency,
        // }),
        formatted: withCurrency(newCurrency)(newAmount).format(),
    };
};
