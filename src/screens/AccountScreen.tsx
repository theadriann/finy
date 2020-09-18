// utils
import React from "react";
import { withSkeleton } from "@src/views/SkeletonView";

// views
import HeaderView from "@src/views/HeaderView";
import WalletListView from "@src/views/wallet/WalletListView";

// styles
import styles from "./AccountScreen.module.scss";
import { CgPocket } from "react-icons/cg";
import { FiSettings } from "react-icons/fi";

interface AccountScreenProps extends GenericComponentProps {}

const AccountScreen: React.FC = (props) => {
    return (
        <div className={styles.container}>
            <HeaderView hideWallet={true} />
            <div className={styles.section}>
                <div className={styles.header}>
                    <CgPocket />
                    <span>Wallets</span>
                </div>
                <div className={styles.content}>
                    <WalletListView />
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.header}>
                    <FiSettings />
                    <span>Settings</span>
                </div>
                <div className={styles.content}>
                    <div className={styles.settingItem}>Clear Data</div>
                    <div
                        className={styles.settingItem}
                        style={{ color: "#FF4D76" }}
                    >
                        Delete Account
                    </div>
                    <div className={styles.settingItem}>Logout</div>
                </div>
            </div>
        </div>
    );
};

export default withSkeleton(AccountScreen);
