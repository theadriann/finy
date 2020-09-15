// styles
import styles from "./MenuView.module.scss";

// utils
import React from "react";
import classnames from "classnames";
import { observer } from "mobx-react";
import { useRootStore } from "@src/stores/RootStore";

// components
import { CgUser, CgChart, CgHome, CgNotes } from "react-icons/cg";

const MenuView: React.FC = observer(() => {
    const { routing, ui } = useRootStore();
    const goTo = (path: string) => routing.history.push(path);

    const style = {
        height: 62 + ui.bottom,
        paddingBottom: ui.bottom,
    };

    return (
        <>
            <div className={styles.container} style={style}>
                <MenuItem
                    active={routing.isOn("/")}
                    icon={<CgHome />}
                    label="Home"
                    onClick={() => goTo("/")}
                />
                <MenuItem
                    active={routing.isOn("/statistics")}
                    icon={<CgChart />}
                    label="Statistics"
                    onClick={() => goTo("/statistics")}
                />
                <MenuItem
                    active={routing.isOn("/transactions")}
                    icon={<CgNotes />}
                    label="Transactions"
                    onClick={() => goTo("/transactions")}
                />
                <MenuItem
                    active={routing.isOn("/account")}
                    icon={<CgUser />}
                    label="Account"
                    onClick={() => goTo("/account")}
                />
            </div>
        </>
    );
});

const MenuItem: React.FC<{
    active: boolean;
    label: string;
    icon: any;
    onClick: any;
}> = ({ active, label, icon, onClick }) => {
    return (
        <div
            className={classnames(styles.item, { active: active })}
            onClick={onClick}
        >
            <div className={styles.icon}>{icon}</div>
            {active && <div className={styles.label}>{label}</div>}
        </div>
    );
};

export default MenuView;
