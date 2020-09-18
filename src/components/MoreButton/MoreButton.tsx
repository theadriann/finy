// components
import { CgMoreAlt } from "react-icons/cg";

// utils
import React, { useEffect, useRef, useState } from "react";

import styles from "./MoreButton.module.scss";

type MoreButtonProps = {
    options: any[];
    onAction?: Function;
};

const MoreButton: React.FC<MoreButtonProps> = ({ options, onAction }) => {
    const [open, setOpen] = useState<boolean>(false);
    const containerRef: React.MutableRefObject<HTMLDivElement | null> = useRef(
        null
    );

    const onButtonClick = () => {
        setOpen(!open);
    };

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleWindowClick = (ev: MouseEvent) => {
            const node = ev.target as Node;

            if (!containerRef.current?.contains(node) && open) {
                setOpen(false);
            }
        };

        window.addEventListener("click", handleWindowClick);

        return function () {
            window.removeEventListener("click", handleWindowClick);
        };
    });

    const renderListItem = (option: any, index: number) => {
        if (option.content) {
            return option.content;
        }

        const onItemClick = () => {
            if (option.onAction) {
                option.onAction();
            } else if (onAction) {
                onAction(option.value);
            }

            setOpen(false);
        };

        return (
            <div key={index} className={styles.item} onClick={onItemClick}>
                {option.label}
            </div>
        );
    };

    const renderList = () => {
        if (!open) {
            return null;
        }

        return <div className={styles.list}>{options.map(renderListItem)}</div>;
    };

    return (
        <div ref={containerRef} className={styles.container}>
            <CgMoreAlt size={20} onClick={onButtonClick} />
            {renderList()}
        </div>
    );
};

export default MoreButton;
