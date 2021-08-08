// utils
import React from "react";
import classnames from "classnames";
import rootStore from "@src/stores/RootStore";
import { observer } from "mobx-react";

// styles
import styles from "@src/views/ControlModal/ControlModal.module.scss";

// icons
import { CgClose } from "react-icons/cg";

// components
import Modal, { ModalProps } from "@src/components/Modal";
import { TextField } from "@material-ui/core";
import Autocomplete from '@material-ui/core/Autocomplete';

interface IAddWalletModal extends ModalProps {}

@observer
export default class AddWalletModal extends Modal<IAddWalletModal> {
    //

    get localStore() {
        return rootStore.ui.addWallet;
    }

    // -----------------------
    // event handling methods
    // -----------------------

    onRequestClose = () => {
        this.localStore.reset();
        this.trigger("onDismiss");

        rootStore.ui.addWallet.active = false;
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
                    <h2>Create Wallet</h2>
                    {this.renderCloseButton()}
                </div>
                <div className={styles.content}>{this.renderControls()}</div>
                <div
                    className={classnames("f-button", styles.submitButton)}
                    onClick={this.localStore.onCreateClick}
                >
                    Create
                </div>
            </>
        );
    }

    renderControls() {
        return (
            <>
                {this.renderTitleControl()}
                {this.renderAmountControl()}
                {this.renderCurrencyControl()}
            </>
        );
    }

    renderTitleControl() {
        return (
            <div className={classnames(styles.control)}>
                <TextField
                    label="Title"
                    value={this.localStore.data.title}
                    variant="standard"
                    className={styles.textInput}
                    onChange={this.localStore.onTitleChange}
                />
            </div>
        );
    }

    renderAmountControl() {
        return (
            <div className={classnames(styles.control)}>
                <TextField
                    label="Amount"
                    value={this.localStore.data.amount.toString()}
                    type="number"
                    variant="standard"
                    className={styles.textInput}
                    onChange={this.localStore.onAmountChange}
                />
            </div>
        );
    }

    renderCurrencyControl() {
        return (
            <div className={classnames(styles.control)}>
                <Autocomplete
                    value={this.localStore.data.currency}
                    onChange={this.localStore.onCurrencyChange}
                    options={["USD", "RON", "EUR"]}
                    getOptionLabel={(currency) => currency}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Currency"
                            variant="standard"
                            className={styles.textInput}
                        />
                    )}
                    className={styles.autocompleteField}
                />
            </div>
        );
    }

    renderCloseButton() {
        return (
            <div className={styles.closeButton} onClick={this.onCloseClick}>
                <CgClose />
            </div>
        );
    }
}
