import React from "react";
import { observer } from "mobx-react";
import { useRootStore } from "@src/stores/RootStore";

import styles from "./AddButton.module.scss";

const AddButton: React.FC<{ onClick?: (...args: any[]) => void }> = observer(
    ({ onClick }) => {
        const { ui } = useRootStore();

        return (
            <div
                style={{ bottom: 80 + ui.bottom }}
                className={styles.container}
                onClick={onClick}
            >
                +
            </div>
        );
    }
);

export default AddButton;
