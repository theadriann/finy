// views
import EditTransactionModal from "./EditTransactionModal";

// utils
import React from "react";
import { observer, Observer, useLocalStore } from "mobx-react";
import { useRootStore } from "@src/stores/RootStore";

const EditTransactionExperience: React.FC = observer(() => {
    //
    const rootStore = useRootStore();
    const _editStore = rootStore.ui.editTransaction;

    return (
        <EditTransactionModal
            open={_editStore.active}
            onSubmit={_editStore.save}
            onDismiss={_editStore.cancel}
        />
    );
});

export default EditTransactionExperience;
