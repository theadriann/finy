import React from "react";
import classnames from "classnames";
import { useSwipeable, Swipeable } from "react-swipeable";
import { useSpring, animated, config as SpringConfig } from "react-spring";
import styles from "./SwipeButton.module.scss";

type SwipeButtonProps = {
    icon: any;
    width: number;
    label: string;
    position: "left" | "right";
    actionable: boolean;

    style?: React.CSSProperties;
    className?: string;
};

const SwipeButton: React.FC<SwipeButtonProps> = ({
    icon,
    style,
    width,
    label,
    position,
    className,
    actionable,
}) => {
    //

    const animatedStyles = useSpring({
        width,
        config: SpringConfig.stiff,
    });

    const otherStyles: React.CSSProperties = {
        left: position === "left" ? 0 : undefined,
        right: position === "right" ? 0 : undefined,
    };

    const classes = classnames(styles.container, className, {
        actionable,
        [styles.actionable]: actionable,
    });

    return (
        <animated.div
            style={{ ...style, ...animatedStyles, ...otherStyles }}
            className={classes}
        >
            <div className={styles.button}>
                {icon}
                <div className={styles.label}>{label}</div>
            </div>
        </animated.div>
    );
};

export default SwipeButton;
