const isDev = process.env.NOMO_ENV === "dev";

module.exports = {
    mode: isDev ? undefined : "jit",
    future: {
        purgeLayersByDefault: true,
        applyComplexClasses: true,
    },
    purge: {
        enabled: isDev ? false : true,
        content: ["./src/**/*.tsx", "./src/**/*.ts"],
    },
    darkMode: false,
    theme: {
        extend: {
            maxWidth: {},
            flex: {
                "005": "0 0 50%",
            },
            fontFamily: {
                sans: [
                    "Poppins",
                    "ui-sans-serif",
                    "system-ui",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    '"Segoe UI"',
                    "Roboto",
                    '"Helvetica Neue"',
                    "Arial",
                    "sans-serif",
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                    '"Noto Color Emoji"',
                ],
            },
            boxShadow: {
                "outline-normal": "0 0 0 2px var(--accents-2)",
                magical:
                    "rgba(0, 0, 0, 0.02) 0px 30px 30px, rgba(0, 0, 0, 0.03) 0px 0px 8px, rgba(0, 0, 0, 0.05) 0px 1px 0px",
            },
            lineHeight: {
                "extra-loose": "2.2",
            },
        },
    },
    variants: {
        extend: {
            backgroundColor: ["active"],
            borderColor: ["active"],
            textColor: ["active"],
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
    ],
};
