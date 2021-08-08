// components
import AddButton from "@src/components/AddButton";
import { BottomSheet } from "react-spring-bottom-sheet";

import "react-spring-bottom-sheet/dist/style.css";

// views
import AddTransactionView from "./AddTransactionView";
import AddTransactionModal from "./AddTransactionModal";

// utils
import React from "react";
import { Observer, useLocalStore } from "mobx-react";

const AddTransactionExperience: React.FC = () => {
    const localStore = useLocalStore(() => ({
        open: false,
        onAddButtonClick() {
            localStore.open = true;
        },
        onModalDismiss() {
            localStore.open = false;
        },
        onModalSubmit() {
            localStore.open = false;
        },
    }));

    return (
        <Observer>
            {() => (
                <div>
                    {/* <AddTransactionModal
                        open={localStore.open}
                        onDismiss={localStore.onModalDismiss}
                        onSubmit={localStore.onModalSubmit}
                    /> */}
                    <BottomSheet
                        open={localStore.open}
                        onDismiss={localStore.onModalDismiss}
                    >
                        <AddTransactionView
                            open={localStore.open}
                            onDismiss={localStore.onModalDismiss}
                            onSubmit={localStore.onModalSubmit}
                        />
                    </BottomSheet>
                    <AddButton onClick={localStore.onAddButtonClick} />
                </div>
            )}
        </Observer>
    );
};

export default AddTransactionExperience;
