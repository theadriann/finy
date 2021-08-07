// imports
import { ReactNode } from "react";

declare global {
    type Pixel = number;
    type StringUndef = string | undefined;
    type TO_CHANGE = any;

    type GetComponentProps<T> = T extends
        | React.ComponentType<infer P>
        | React.Component<infer P>
        ? P
        : never;

    type GenericComponentProps = {
        id?: string;
        style?: React.CSSProperties;
        className?: string;

        children?: ReactNode;

        ref?: any;
        innerRef?: any;
    };

    type ReactGenericContent =
        | ReactNode
        | React.ReactElement
        | (() => any)
        | undefined;

    type Currency = "RON" | "USD" | "EUR";

    interface Window {
        rootStore: any;
        firebase: any;
        ratesCache: any;
    }

    declare module "*.scss" {
        const content: Record<string, string>;
        export default content;
    }

    // declare module "*.scss" {
    //     const content: Record<string, string>;
    //     export default content;
    // }
}
