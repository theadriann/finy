// components
import MoneyViewer from "@src/views/MoneyViewer";

// models
import Wallet from "@src/models/Wallet";

// utils
import React from "react";
import { useRootStore } from "@src/stores/RootStore";
import { observer } from "mobx-react";

// styles
import styles from "./WalletSwitcher.module.scss";

const WalletSwitcher: React.FC = observer(() => {
    const { wallet: walletStore, data, ui } = useRootStore();
    const wallet = walletStore.wallet || walletStore.invalid;
    const walletsList = walletStore.active.slice();

    if (wallet.archived) {
        walletsList.push(wallet);
    }

    if (!walletsList.length) {
        walletsList.push(walletStore.invalid);
    }

    const onWalletChange = (event: any) => {
        if (event.target.value === "new") {
            ui.addWallet.active = true;
            return;
        }

        walletStore.setWalletId(event.target.value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.switcher}>
                <select
                    value={wallet.id}
                    className={styles.select}
                    onChange={onWalletChange}
                >
                    <WalletList list={walletsList} />
                    <option value="new">Create a new wallet</option>
                </select>
            </div>
            <div className={styles.money}>
                <MoneyViewer
                    amount={wallet.amount}
                    currency={wallet.currency}
                />
            </div>
        </div>
    );
});

type WalletListProps = {
    list: Wallet[];
};

const WalletList: React.FC<WalletListProps> = ({ list }) => {
    return (
        <>
            {list.map((wallet) => {
                return (
                    <option key={wallet.id} value={wallet.id}>
                        {wallet.title}
                    </option>
                );
            })}
        </>
    );
};

export default WalletSwitcher;
