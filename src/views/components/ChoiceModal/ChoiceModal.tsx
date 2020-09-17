// utils
import React from "react";
import classnames from "classnames";
import rootStore from "@src/stores/RootStore";
import { observer } from "mobx-react";

// styles
import styles from "./ChoiceModal.module.scss";

// icons
import { CgClose } from "react-icons/cg";

// components
import Modal, { ModalProps } from "@src/components/Modal";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

interface IChoiceModal extends ModalProps {}

@observer
export default class ChoiceModal extends Modal<IChoiceModal> {
    //

    get localStore() {
        return rootStore.ui.choiceModal;
    }

    // -----------------------
    // event handling methods
    // -----------------------

    onRequestClose = () => {
        this.localStore.close();
    };

    // -----------------------
    // rendering methods
    // -----------------------

    render() {
        if (!this.props.open) {
            return null;
        }

        return this.renderModal({ modalClassName: styles.modal });
    }

    renderModalContent() {
        return (
            <>
                <div className={styles.topbar}>
                    <h2>{this.localStore.options.title}</h2>
                </div>
                <div className={styles.content}>
                    <div className={styles.description}>
                        {this.localStore.options.description}
                    </div>
                    <div className={styles.filler} />
                    {this.renderButtons()}
                </div>
            </>
        );
    }

    renderButtons = () => {
        return this.localStore.options.buttons?.map(this.renderButton);
    };

    renderButton = (options: any) => {
        return (
            <div
                key={options.value}
                onClick={(event: any) =>
                    this.localStore.onChoiceTaken(event, options.value)
                }
                className={classnames("f-button", styles.button)}
            >
                {options.label}
            </div>
        );
    };
}
