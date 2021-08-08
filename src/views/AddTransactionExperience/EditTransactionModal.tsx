// utils
import React from "react";
import dayjs from "@src/utils/dayjs";
import classnames from "classnames";
import rootStore from "@src/stores/RootStore";
import { observer } from "mobx-react";
import { action, computed, makeObservable, observable } from "mobx";

// styles
import styles from "@src/views/ControlModal/ControlModal.module.scss";

// icons
import { CgClose } from "react-icons/cg";

// models
import Payee from "@src/models/Payee";
import Category from "@src/models/Category";

// components
import Modal, { ModalProps } from "@src/components/Modal";
import Switch from "@src/components/Switch";
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/core/Autocomplete";
// import { DatePicker } from "@material-ui/pickers/DatePicker";

interface IAddTransactionModal extends ModalProps {
    onSubmit: Function;
}

@observer
export default class AddTransactionModal extends Modal<IAddTransactionModal> {
    //

    constructor(props: any) {
        super(props);

        const config: any = {
            data: computed,
            store: computed,
        };
        makeObservable(this, config);
    }

    // -----------------------
    // event handling methods
    // -----------------------

    // onPayeeChange = (event: any, payee: Payee | string | null) => {
    //     if (!payee) {
    //         this.data.payeeInput = "";
    //         this.data.payee = null;
    //         return;
    //     }

    //     if (typeof payee === "string") {
    //         payee = rootStore.data.createPayee({
    //             name: payee.replace("Add ", ""),
    //         });
    //     }

    //     this.data.payeeInput = payee.name;
    //     this.data.payee = payee;
    // };

    // onPayeeInputChange = (event: any, name: string) => {
    //     this.data.payeeInput = name;
    // };

    // onAmountChange = (event: any) => {
    //     this.data.amount = Number(event.target.value);
    // };

    // onCurrencyChange = (event: any, currency: any) => {
    //     this.data.currency = currency || "RON";
    // };

    // onDateChange = (newValue: any) => {
    //     this.data.date = newValue;
    // };

    // onCategoryChange = (event: any, category: Category | null | string) => {
    //     if (!category) {
    //         this.data.categoryInput = "";
    //         this.data.category = null;
    //         return;
    //     }

    //     if (typeof category === "string") {
    //         category = rootStore.data.createCategory({
    //             label: category.replace("Add ", ""),
    //         });
    //     }

    //     this.data.categoryInput = category.label;
    //     this.data.category = category || null;
    // };

    // onCategoryInputChange = (event: any, categoryName: any) => {
    //     this.data.categoryInput = categoryName;
    // };

    // onOutFlowChange = (value: any) => {
    //     this.data.outflow = value;
    // };

    // onSubmitClick = () => {
    //     if (!this.isValid) {
    //         return false;
    //     }

    //     const data = this.data;
    //     const { onSubmit } = this.props;

    //     rootStore.data.addTransaction({
    //         date: dayjs(data.date).unix(),
    //         flow: data.outflow ? "out" : "in",
    //         amount: data.amount,
    //         currency: data.currency as Currency,
    //         payeeId: data.payee?.id,
    //         walletId: rootStore.wallet.walletId,
    //         categoryId: data.category?.id,
    //     });

    //     rootStore.data.saveData();
    //     rootStore.wallet.processTransactions();

    //     this.reset();

    //     onSubmit && onSubmit();
    // };

    // onRequestClose = () => {
    //     this.reset();
    //     this.trigger("onDismiss");
    // };

    get store() {
        return rootStore.ui.editTransaction;
    }

    get data() {
        return this.store.data;
    }

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
        const onSubmit = this.props.onSubmit;

        return (
            <>
                <div className={styles.topbar}>
                    <h2>Edit Transaction</h2>
                    {this.renderCloseButton()}
                </div>
                <div className={styles.content}>{this.renderControls()}</div>
                <div
                    className={classnames("f-button", styles.submitButton)}
                    onClick={() => onSubmit && onSubmit()}
                >
                    Save
                </div>
            </>
        );
    }

    renderControls() {
        return (
            <>
                {this.renderPayeeControl()}
                {this.renderDateControl()}
                {this.renderAmountControl()}
                {this.renderCurrencyControl()}
                {this.renderCategoryControl()}
                {this.renderOutflowControl()}
            </>
        );
    }

    renderPayeeControl() {
        const inputValue = this.data.payeeInput;
        const value: Payee | string | null = this.data.payee;

        // get all payees
        const options: any = rootStore.data.payees.arr.slice();

        // add "create this new payee"
        if (inputValue.length) {
            options.push(`Add ${inputValue}`);
        }

        const getOptionLabel = (payee: Payee | string | null) => {
            if (!payee) {
                return "";
            }

            if (typeof payee === "string") {
                return payee;
            }

            return payee.name;
        };

        return (
            <div className={classnames(styles.control)}>
                <Autocomplete
                    clearOnEscape={false}
                    value={value}
                    options={options}
                    inputValue={inputValue}
                    onChange={this.store.onPayeeSelect}
                    onInputChange={this.store.onPayeeInputChange}
                    getOptionLabel={getOptionLabel}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Payee"
                            variant="standard"
                            className={styles.textField}
                        />
                    )}
                    className={styles.autocompleteField}
                />
            </div>
        );
    }

    renderAmountControl() {
        return (
            <div className={classnames(styles.control)}>
                <TextField
                    label="Amount"
                    value={this.data.amount.toString()}
                    variant="standard"
                    type="number"
                    className={styles.textField}
                    onChange={this.store.onAmountChange}
                />
            </div>
        );
    }

    renderCurrencyControl() {
        const value = this.data.currency;
        const onCurrencyChange = this.store.onCurrencyChange;

        return (
            <div className={classnames(styles.control)}>
                <Autocomplete
                    value={value}
                    onChange={onCurrencyChange}
                    options={["USD", "RON", "EUR"]}
                    getOptionLabel={(currency) => currency}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Currency"
                            variant="standard"
                            className={styles.textField}
                        />
                    )}
                    className={styles.autocompleteField}
                />
            </div>
        );
    }

    renderDateControl() {
        const value = this.data.date;
        const onDateChange = this.store.onDateChange;

        return (
            <div className={classnames(styles.control)}>
                {/* <DatePicker
                    label="Date"
                    value={value}
                    className={styles.textField}
                    onChange={onDateChange}
                    renderInput={(props: any) => <TextField {...props} />}
                /> */}
            </div>
        );
    }

    renderCategoryControl() {
        const value: Category | null | string = this.data.category;
        const options: any = rootStore.data.categories.arr.slice();

        if (this.data.categoryInput.length) {
            options.push(`Add ${this.data.categoryInput}`);
        }

        const getOptionLabel = (category: Category | string | undefined) => {
            if (!category) {
                return "";
            }

            if (typeof category === "string") {
                return category;
            }

            return category.label;
        };

        return (
            <div className={classnames(styles.control)}>
                <Autocomplete
                    value={value}
                    options={options}
                    inputValue={this.data.categoryInput}
                    onChange={this.store.onCategoryChange}
                    onInputChange={this.store.onCategoryInputChange}
                    getOptionLabel={getOptionLabel}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Category"
                            variant="standard"
                            className={styles.textField}
                        />
                    )}
                    className={styles.autocompleteField}
                />
            </div>
        );
    }

    renderOutflowControl() {
        return (
            <div className={classnames(styles.flowControl, styles.control)}>
                <label>Outflow</label>
                <Switch
                    checked={this.data.outflow}
                    onChange={this.store.onOutFlowChange}
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
