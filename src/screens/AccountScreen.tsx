// styles
import styles from "./AccountScreen.module.scss";

// utils
import React from "react";
import { withSkeleton } from "@src/views/SkeletonView";

// views
import HeaderView from "@src/views/HeaderView";

interface AccountScreenProps extends GenericComponentProps {}

const AccountScreen: React.FC = (props) => {
    return (
        <div className={styles.container}>
            <HeaderView hideWallet={true} />
            <div className={styles.header}>My Account</div>
        </div>
    );
};

export default withSkeleton(AccountScreen);
