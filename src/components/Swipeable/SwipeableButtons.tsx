import React from "react";
import { useSwipeable, Swipeable } from "react-swipeable";
import { useSpring, config as SpringConfig } from "react-spring";

import SwipeButton from "./SwipeButton";

type SwipeableButtonOption = {
    icon: any;
    label: string;
    position: "left" | "right";

    style?: React.CSSProperties;
    className?: string;

    onAction?: Function;
};

const SwipeableButtons: React.FC<
    GenericComponentProps & {
        buttons: SwipeableButtonOption[];
        threshold?: number;
        children: (...args: any[]) => React.ReactElement;
    }
> = ({ buttons, className, children, threshold = 120 }) => {
    //

    const [deltaX, setDeltaX] = React.useState<number>(0);
    const [leftSpace, setLeftSpace] = React.useState<number>(0);
    const [rightSpace, setRightSpace] = React.useState<number>(0);
    const [direction, setDirection] = React.useState<string | undefined>(
        undefined
    );

    const swipeableProps = useSwipeable({
        onSwiped: (eventData) => {
            // return to normal
            setDeltaX(0);
            setDirection(undefined);

            // skip if too little
            if (Math.abs(deltaX) < threshold) {
                return;
            }

            // do action
            let button: any = undefined;
            if (direction === "Left") {
                button = buttons.find((b) => b.position === "right");
            } else if (direction === "Right") {
                button = buttons.find((b) => b.position === "left");
            }

            if (!button) {
                return;
            }

            button.onAction && button.onAction();
        },
        onSwiping: (eventData) => {
            // changing direction is not supported
            if (direction && direction !== eventData.dir) {
                setDeltaX(0);
                return;
            }

            // setting direction
            if (!direction) {
                setDirection(eventData.dir);
            }

            // updating delta
            setDeltaX(-eventData.deltaX);
        },
        trackMouse: true,
        trackTouch: true,
    });

    const animatedProps = useSpring({
        left: deltaX,
        config: SpringConfig.stiff,
    });

    const renderButton = (button: SwipeableButtonOption, index: number) => {
        let width = 0;

        if (
            (button.position === "left" && deltaX > 0) ||
            (button.position === "right" && deltaX < 0)
        ) {
            width = Math.abs(deltaX);
        }

        const visible = width > 0;
        const actionable = width >= threshold;

        return (
            <SwipeButton
                key={index}
                width={width}
                actionable={actionable}
                {...button}
            />
        );
    };

    const renderButtons = () => buttons.map(renderButton);

    return (
        <div className={className} {...swipeableProps}>
            {children(animatedProps)}
            {renderButtons()}
        </div>
    );
};

SwipeableButtons.defaultProps = {
    threshold: 120,
};

export default SwipeableButtons;
