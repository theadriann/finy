// utils
import React from "react";
import { withSkeleton } from "@src/views/SkeletonView";

// styles
import styles from "./HomeScreen.module.scss";

// views
import HeaderView from "@src/views/HeaderView";

interface HomeScreenProps extends GenericComponentProps {}

const HomeScreen: React.FC = (props) => {
    return (
        <div className={styles.container}>
            <HeaderView />
            <div className={styles.header}>Hello World</div>
        </div>
    );
};

export default withSkeleton(HomeScreen);
