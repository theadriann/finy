// utils
import React from "react";
import dayjs from "@src/utils/dayjs";
import classnames from "classnames";
import rootStore from "@src/stores/RootStore";
import { observer } from "mobx-react";
import { action, computed, makeObservable, observable } from "mobx";

// styles
import s from "@/components/BottomSheet/BottomSheet.module.scss";
import styles from "@src/views/ControlModal/ControlModal.module.scss";

// icons
import { CgClose } from "react-icons/cg";

// models
import Payee from "@src/models/Payee";
import Category from "@src/models/Category";

// components
import Switch from "@src/components/Switch";
import Autocomplete from "@material-ui/core/Autocomplete";
import { TextField } from "@material-ui/core";
import DatePicker from "@material-ui/lab/DatePicker";
import { TextInput } from "@/components/TextInput";
import { ComboBox } from "@/components/ComboBox";
import { InputField } from "@/components/InputField";

@observer
export default class AddTransactionView extends React.Component<any> {
    //

    data: {
        payee: Payee | null;
        payeeInput: string;
        category: Category | null;
        categoryInput: string;
        date: any;
        amount: number;
        currency: string;
        outflow: boolean;
    } = {
        payee: null,
        payeeInput: "",
        categoryInput: "",
        category: null,
        amount: 0,
        currency: "RON",
        date: dayjs(),
        outflow: true,
    };

    constructor(props: any) {
        super(props);

        const config: any = {
            data: observable,
            //
            onNewPayee: action,
            onNewCategory: action,
            onPayeeChange: action,
            onPayeeInputChange: action,
            onCategoryInputChange: action,
            onCategoryChange: action,
            onOutFlowChange: action,
            onAmountChange: action,
            onCurrencyChange: action,
            onSubmitClick: action,
            reset: action,
            //
            isValid: computed,
        };
        makeObservable(this, config);
    }

    reset() {
        this.data = {
            payee: null,
            payeeInput: "",
            categoryInput: "",
            category: null,
            amount: 0,
            currency: "RON",
            date: dayjs(),
            outflow: true,
        };
    }

    // -----------------------
    // event handling methods
    // -----------------------

    onNewPayee = (payeeName: string) => {
        if (!payeeName) {
            this.data.payeeInput = "";
            this.data.payee = null;
            return;
        }

        const payee = rootStore.data.createPayee({
            name: payeeName,
        });

        this.data.payeeInput = payee.name;
        this.data.payee = payee;
    };

    onPayeeChange = (event: any, payee?: Payee) => {
        if (!payee) {
            this.data.payeeInput = "";
            this.data.payee = null;
            return;
        }

        this.data.payeeInput = payee.name;
        this.data.payee = payee;
    };

    onPayeeInputChange = (name: string) => {
        this.data.payeeInput = name;
    };

    onAmountChange = (value: any) => {
        this.data.amount = Number(value);
    };

    onCurrencyChange = (event: any, currency: any) => {
        this.data.currency = currency || "RON";
    };

    onDateChange = (newValue: any) => {
        this.data.date = newValue;
    };

    onCategoryChange = (event: any, category: Category | null) => {
        if (!category) {
            this.data.categoryInput = "";
            this.data.category = null;
            return;
        }

        this.data.categoryInput = category.label;
        this.data.category = category || null;
    };

    onNewCategory = (categoryName: any) => {
        if (!categoryName) {
            this.data.categoryInput = "";
            this.data.category = null;
            return;
        }

        const category = rootStore.data.createCategory({
            label: categoryName,
        });

        this.data.categoryInput = category.label;
        this.data.category = category;
    };

    onCategoryInputChange = (categoryName: any) => {
        this.data.categoryInput = categoryName;
    };

    onOutFlowChange = (value: any) => {
        this.data.outflow = value;
    };

    onSubmitClick = () => {
        if (!this.isValid) {
            return false;
        }

        const data = this.data;
        const { onSubmit }: any = this.props;

        rootStore.data.addTransaction({
            date: dayjs(data.date).unix(),
            flow: data.outflow ? "out" : "in",
            amount: data.amount,
            currency: data.currency as Currency,
            payeeId: data.payee?.id,
            walletId: rootStore.wallet.walletId,
            categoryId: data.category?.id,
        });

        rootStore.data.saveData();
        rootStore.wallet.processTransactions();

        this.reset();

        onSubmit && onSubmit();
    };

    onRequestClose = () => {
        this.reset();
        this.trigger("onDismiss");
    };

    trigger = (
        eventName: "onOpen" | "onDismiss" | "innerOverlayRef" | "innerModalRef",
        ...args: any[]
    ) => {
        const fn: any = this.props[eventName];

        if (fn) {
            fn(...args);
        }
    };

    get isValid() {
        if (
            !this.data.payee ||
            !this.data.date ||
            !this.data.category ||
            !this.data.currency ||
            typeof this.data.payee === "string"
        ) {
            return false;
        }

        return true;
    }

    // -----------------------
    // rendering methods
    // -----------------------

    render() {
        return (
            <div className={styles.sheetContainer}>
                <div className={s.titleContainer}>
                    {this.renderCloseButton()}
                    <h2>Add Transaction</h2>
                </div>
                <div className={styles.content} style={{ padding: 16 }}>
                    {this.renderControls()}
                </div>
                <div
                    className={classnames(
                        "f-button",
                        styles.relativeSubmitButton
                    )}
                    onClick={this.onSubmitClick}
                >
                    Add
                </div>
            </div>
        );
    }

    renderControls() {
        return (
            <>
                {this.renderAmountControl()}
                {this.renderCurrencyControl()}
                {this.renderPayeeControl()}
                {this.renderDateControl()}
                {this.renderCategoryControl()}
                {this.renderOutflowControl()}
            </>
        );
    }

    renderPayeeControl() {
        const inputValue = this.data.payeeInput;
        const options: any = rootStore.data.payees.arr.slice();
        const filteredOptions = options.filter((item: Payee) =>
            item.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        const canCreateNewItem =
            inputValue &&
            (filteredOptions.length !== 1 ||
                filteredOptions[0].name.toLowerCase() !==
                    inputValue.toLowerCase());

        return (
            <div className={classnames(styles.control)}>
                <InputField label="Payee" />
                <ComboBox
                    items={filteredOptions}
                    value={this.data.payee}
                    inputValue={this.data.payeeInput}
                    onInputChange={this.onPayeeInputChange}
                    onItemSelect={(item: any) => this.onPayeeChange(null, item)}
                    itemLabelRenderer={(item: any) => item && item.name}
                    canCreateNewItem={canCreateNewItem}
                    onCreateNewItem={() =>
                        this.onNewPayee(this.data.payeeInput)
                    }
                />
            </div>
        );
    }

    renderAmountControl() {
        return (
            <div className={classnames(styles.control)}>
                <InputField label="Amount" />
                <TextInput
                    pattern="[0-9]*"
                    inputmode="decimal"
                    value={this.data.amount.toString()}
                    onChange={this.onAmountChange}
                />
            </div>
        );
    }

    renderCurrencyControl() {
        return (
            <div className={classnames(styles.control)}>
                <InputField label="Currency" />
                <ComboBox
                    items={["USD", "RON", "EUR"]}
                    value={this.data.currency}
                    onItemSelect={(item: any) =>
                        this.onCurrencyChange(null, item)
                    }
                    itemLabelRenderer={(item: any) => item}
                />
            </div>
        );
    }

    renderDateControl() {
        return (
            <div className={classnames(styles.control)}>
                <DatePicker
                    label="Date"
                    value={this.data.date}
                    className={styles.textField}
                    onChange={this.onDateChange}
                    renderInput={(props: any) => <TextField {...props} />}
                />
            </div>
        );
    }

    renderCategoryControl() {
        const value: Category | string | null = this.data.category;
        const options = rootStore.data.categories.arr.slice();
        const inputValue = this.data.categoryInput || "";
        const filteredOptions = options.filter((item: Category) =>
            item.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        const canCreateNewItem =
            inputValue &&
            (filteredOptions.length !== 1 ||
                filteredOptions[0].label.toLowerCase() !==
                    inputValue.toLowerCase());

        const getOptionLabel = (category: Category | string | null) => {
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
                <InputField label="Category" />
                <ComboBox
                    items={filteredOptions}
                    value={value}
                    inputValue={inputValue}
                    onInputChange={this.onCategoryInputChange}
                    onItemSelect={(item: Category) =>
                        this.onCategoryChange(null, item)
                    }
                    itemLabelRenderer={(item: Category) => item && item.label}
                    canCreateNewItem={canCreateNewItem}
                    onCreateNewItem={() => this.onNewCategory(inputValue)}
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
                    onChange={this.onOutFlowChange}
                />
            </div>
        );
    }

    renderCloseButton() {
        return (
            <div
                className={s.closeButton}
                onClick={() => this.trigger("onDismiss")}
            >
                <CgClose />
            </div>
        );
    }
}
