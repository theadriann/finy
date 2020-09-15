// styles
import styles from "./StatisticsScreen.module.scss";

// utils
import React from "react";
import { withSkeleton } from "@src/views/SkeletonView";

// views
import HeaderView from "@src/views/HeaderView";

interface StatisticsScreenProps extends GenericComponentProps {}

const StatisticsScreen: React.FC = (props) => {
    return (
        <div className={styles.container}>
            <HeaderView />
            <div className={styles.header}>stats</div>
        </div>
    );
};

export default withSkeleton(StatisticsScreen);
