//
import { ReactNode } from "react";

declare global {
    type GenericComponentProps = {
        id?: string;
        style?: any;
        className?: string;

        children?: ReactNode;

        innerRef?: Function;
    };

    type Currency = "RON" | "USD" | "RON";

    type GetComponentProps<T> = T extends
        | React.ComponentType<infer P>
        | React.Component<infer P>
        ? P
        : never;

    interface Window {
        rootStore: any;
        firebase: any;
        ratesCache: any;
    }
}
