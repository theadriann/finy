// components
import MoreButton from "@src/components/MoreButton";

// models
import Wallet from "@src/models/Wallet";

// utils
import React, { useEffect } from "react";
import { observer, useLocalStore } from "mobx-react";
import { useRootStore } from "@src/stores/RootStore";

// views
import MoneyViewer from "../MoneyViewer";

import styles from "./WalletListView.module.scss";

type WalletListViewProps = {};

const WalletListView: React.FC<WalletListViewProps> = observer(({}) => {
    //

    const wallets = useRootStore().data.wallets.arr;
    const activeWallets = wallets.filter((wallet) => !wallet.archived);
    const archivedWallets = wallets.filter((wallet) => wallet.archived);

    const localStore = useLocalStore(() => ({
        showingHidden: false,
        toggleHidden() {
            localStore.showingHidden = !localStore.showingHidden;
        },
    }));

    useEffect(() => {
        if (!archivedWallets.length && localStore.showingHidden) {
            localStore.toggleHidden();
        }
    });

    const renderArchivedWallets = () => {
        if (!localStore.showingHidden) {
            return null;
        }

        return (
            <>
                <div className={styles.subheader}>Archived Wallets</div>
                {archivedWallets.map((wallet) => (
                    <WalletListItemView key={wallet.id} wallet={wallet} />
                ))}
            </>
        );
    };

    const renderArchivedToggler = () => {
        if (!archivedWallets.length) {
            return null;
        }

        return (
            <div
                className={styles.hiddenToggler}
                onClick={localStore.toggleHidden}
            >
                {localStore.showingHidden
                    ? "Hide archived wallets"
                    : "Show archived wallets"}
            </div>
        );
    };

    if (!wallets.length) {
        return null;
    }

    return (
        <div>
            {activeWallets.map((wallet) => (
                <WalletListItemView key={wallet.id} wallet={wallet} />
            ))}
            {renderArchivedWallets()}
            {renderArchivedToggler()}
        </div>
    );
});

const WalletListItemView: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
    const store = useRootStore();

    return (
        <div className={styles.walletItem}>
            <div className={styles.content}>
                <div className={styles.details}>
                    <div className={styles.title}>{wallet.title}</div>
                    <div className={styles.money}>
                        <MoneyViewer
                            amount={wallet.amount}
                            currency={wallet.currency}
                        />
                    </div>
                </div>
                <div className={styles.actions}>
                    <MoreButton
                        options={[
                            { label: "Edit", value: "edit" },
                            {
                                label: wallet.archived
                                    ? "Unarchive"
                                    : "Archive",
                                onAction: () =>
                                    store.wallet.toggleArchiveWallet(wallet),
                            },
                            {
                                label: "Delete",
                                onAction: () => store.data.deleteWallet(wallet),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default WalletListView;
