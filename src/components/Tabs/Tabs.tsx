import React from "react";
import classnames from "classnames";

import styles from "./Tabs.module.scss";

export type TabOption = {
    label: string;
    value?: string;
    selected?: boolean;
};

export interface TabsProps extends GenericComponentProps {
    value?: string;
    options: TabOption[];

    onValueChange?: (value: string) => any;
    onOptionsChange?: (...args: any[]) => any;
}

export interface TabProps extends GenericComponentProps {
    label: string;
    selected: boolean;

    onClick: (...args: any[]) => void;
}

export const Tabs: React.FC<TabsProps> = ({
    value,
    options,
    className,
    onValueChange,
    onOptionsChange,
}) => {
    //

    const renderTab = (option: TabOption, index: number) => {
        const selected =
            option.selected !== undefined
                ? option.selected
                : option.value === value;

        const onTabClick = () => {
            if (option.selected === undefined) {
                let value = option.value || "";

                return onValueChange && onValueChange(value);
            }

            const newOptions = options.slice();

            for (let i = 0; i < newOptions.length; i++) {
                newOptions[i].selected = i === index ? true : false;
            }

            onOptionsChange && onOptionsChange(newOptions);
        };

        return (
            <Tab
                key={option.value || option.label}
                label={option.label}
                selected={selected}
                onClick={onTabClick}
            />
        );
    };

    const renderTabs = (options: TabOption[]) => options.map(renderTab);

    return (
        <div className={classnames(styles.container, className)}>
            {renderTabs(options)}
        </div>
    );
};

export const Tab: React.FC<TabProps> = ({ label, selected, onClick }) => {
    const classes = classnames(styles.tab, "tab-component", { selected });

    return (
        <div className={classes} onClick={onClick}>
            {label}
        </div>
    );
};

export default Tabs;
