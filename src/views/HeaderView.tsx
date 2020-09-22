import { useRootStore } from "@src/stores/RootStore";
import { observer } from "mobx-react";
import React from "react";
import styles from "./HeaderView.module.scss";
import WalletSwitcher from "@src/views/WalletSwitcher";

type HeaderViewProps = {
    hideWallet?: boolean;
};

const HeaderView: React.FC<HeaderViewProps> = ({ children, hideWallet }) => {
    return (
        <div className={styles.container}>
            <Title />
            {!hideWallet && <WalletSwitcher />}
            {children}
        </div>
    );
};

HeaderView.defaultProps = {
    hideWallet: false,
};

const Title: React.FC = observer(() => {
    const { routing } = useRootStore();

    let title = "Home v2";

    if (routing.isOn("/transactions")) {
        title = "Transactions";
    } else if (routing.isOn("/statistics")) {
        title = "Statistics";
    } else if (routing.isOn("/account")) {
        title = "Account";
    }

    return <div className={styles.title}>{title}</div>;
});

export default HeaderView;
