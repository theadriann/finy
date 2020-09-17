import fetch from "node-fetch";
import dayjs from "@src/utils/dayjs";

let ratesCache: any = {};

export const fetchLatestRates = async () => {
    const todayDate = dayjs().format("YYYY-MM-DD");

    if (ratesCache[todayDate]) {
        return ratesCache[todayDate];
    }

    try {
        const url = `https://api.exchangeratesapi.io/latest`;
        const json = await (await fetch(url)).json();

        ratesCache[json.date] = json.rates;
    } catch (e) {
        console.warn(`Couldn't fetch latest rates`);
    }

    return ratesCache[todayDate];
};

export const fetchRatesAt = async (at: string) => {
    if (ratesCache[at]) {
        return ratesCache[at];
    }

    try {
        const url = `https://api.exchangeratesapi.io/${at}`;
        const json = await (await fetch(url)).json();

        ratesCache[json.date] = json.rates;
        ratesCache[at] = json.rates; // TODO: fix for when date is not found
    } catch (e) {
        console.warn(`Couldn't fetch latest rates`);
    }

    return ratesCache[at];
};
