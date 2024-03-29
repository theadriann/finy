// utils
import React from "react";
import { observer } from "mobx-react";
import { useRootStore } from "@src/stores/RootStore";

// views
// import MenuView from "./Menu/MenuView";
import ChoiceModal from "@src/views/components/ChoiceModal";
import AddWalletModal from "@src/views/AddWalletModal";

// styles
import styles from "./SkeletonView.module.scss";

const SkeletonView: React.FC = ({ children }) => {
    return (
        <div className={styles.container}>
            {children}
            {/* <MenuView /> */}
        </div>
    );
};

export const withSkeleton = (ChildComponent: React.FC) =>
    observer((props: GetComponentProps<typeof ChildComponent>) => {
        const store = useRootStore();

        return (
            <SkeletonView>
                <ChildComponent {...props} />
                <AddWalletModal open={store.ui.addWallet.active} />
                <ChoiceModal open={store.ui.choiceModal.active} />
            </SkeletonView>
        );
    });

export default SkeletonView;
