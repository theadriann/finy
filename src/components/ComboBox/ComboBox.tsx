// components
import { Popover } from "@headlessui/react";
import { TextInputWithRef } from "../TextInput";

// utils
import cn from "classnames";
import { usePopper } from "react-popper";
import React, { useContext, createContext, useState } from "react";
import { filter } from "lodash";

const CONTEXT_DEFAULT_VALUE: {
    value?: any;
    inputValue?: string;
    itemRenderer?: any;
    itemLabelRenderer?: any;
    itemContentRenderer?: any;
} = {};

const ComboBoxContext = createContext(CONTEXT_DEFAULT_VALUE);
const useComboBoxContext = () => useContext(ComboBoxContext);

//
export const ComboBox = (props: any) => {
    //
    let {
        inputValue: explicitInputValue,
        value,
        items,
        onItemSelect,
        onCreateNewItem,
        onInputChange,
        canCreateNewItem,
        itemFilterer,
        itemRenderer,
        itemLabelRenderer,
        itemContentRenderer,
    } = props;

    //
    const [localInputValue, setLocalInputValue] = useState(
        itemLabelRenderer && itemLabelRenderer(value)
    );
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const onInputBlur = () => setTimeout(() => setPopoverOpen(false), 275);
    const onInputFocus = () => setPopoverOpen(true);

    //
    const [referenceElement, setReferenceElement] = useState();
    const [popperElement, setPopperElement]: any = useState();
    const { styles, attributes } = usePopper(referenceElement, popperElement);

    const _onInputChange = (value: any) => {
        setLocalInputValue(value);
        onInputChange && onInputChange(value);
    };

    // use a default variabile for the input value
    const inputValue = explicitInputValue ?? localInputValue;

    // filter items
    const filteredItems = itemFilterer
        ? items.filter((item: any) => itemFilterer(item, inputValue))
        : items;

    // on-enter-key submit the value
    const onInputKeyPress = (e: KeyboardEvent) => {
        if (e.code === "Enter") {
            console.log(`should pick first available or new`);
        }
    };

    // condition to show the creation of new item or not
    const canShowNewItem =
        typeof canCreateNewItem === "function"
            ? canCreateNewItem(inputValue, filteredItems)
            : canCreateNewItem;

    //
    const _onCreateNewItem = () =>
        onCreateNewItem && onCreateNewItem(inputValue);

    const _onItemSelect = (item: any) => {
        const returnValue = onItemSelect && onItemSelect(item);
        const newInputValue =
            returnValue || (itemLabelRenderer && itemLabelRenderer(item));

        newInputValue && setLocalInputValue(newInputValue);
    };

    //
    const shouldShowPopover =
        isPopoverOpen && (filteredItems.length || canShowNewItem);

    return (
        <ComboBoxContext.Provider
            value={{
                value,
                inputValue,
                itemRenderer,
                itemLabelRenderer,
                itemContentRenderer,
            }}
        >
            <div className="relative">
                <TextInputWithRef
                    innerRef={setReferenceElement}
                    value={inputValue}
                    onBlur={onInputBlur}
                    onFocus={onInputFocus}
                    onChange={_onInputChange}
                    onKeyPress={onInputKeyPress}
                />
                <Popover>
                    {shouldShowPopover && (
                        <Popover.Panel
                            static
                            ref={setPopperElement}
                            style={styles.popper}
                            {...attributes.popper}
                            className="absolute z-50 mt-3 w-full top-0 max-h-96 bg-white"
                        >
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-2">
                                <RenderComboItems
                                    items={filteredItems}
                                    onItemClick={_onItemSelect}
                                />
                                {canShowNewItem && (
                                    <RenderAddComboItem
                                        onNewItem={_onCreateNewItem}
                                    />
                                )}
                            </div>
                        </Popover.Panel>
                    )}
                </Popover>
            </div>
        </ComboBoxContext.Provider>
    );
};

const RenderComboItems = ({
    items,
    onItemClick,
}: {
    items: any[];
    onItemClick?: any;
}) => {
    const ctx = useComboBoxContext();

    return (
        <>
            {(items || []).map((item: any, index: number) => (
                <RenderComboItem
                    key={item.id || index}
                    item={item}
                    onClick={onItemClick}
                />
            ))}
        </>
    );
};

const RenderComboItem = ({ item, onClick }: { item: any; onClick?: any }) => {
    const ctx = useComboBoxContext();
    const isSelected = ctx.value === item;

    // use external item renderer
    if (ctx.itemRenderer) {
        return ctx.itemRenderer(item);
    }

    const renderContent = () => {
        // use external item content renderer
        if (ctx.itemContentRenderer) {
            return ctx.itemContentRenderer(item);
        }

        // use external item label renderer
        if (ctx.itemLabelRenderer) {
            return ctx.itemLabelRenderer(item);
        }

        return item?.label || item.toString();
    };

    const _onClick = (e: any) => onClick && onClick(item, e);
    const hoverClassname = `hover:bg-gray-300 hover:cursor-pointer`;
    const selectedClassname = isSelected && `text-indigo-500 font-bold`;

    return (
        <div
            className={cn(
                "flex flex-row items-center py-2 px-2",
                hoverClassname,
                selectedClassname
            )}
            onClick={_onClick}
        >
            {renderContent()}
        </div>
    );
};

const RenderAddComboItem = ({ onNewItem }: any) => {
    //
    const ctx = useComboBoxContext();

    //
    const hoverClassname = `hover:bg-gray-100 hover:cursor-pointer`;

    //
    return (
        <div
            className={cn(
                "flex flex-row items-center justify-center py-2",
                hoverClassname
            )}
            onClick={onNewItem}
        >
            Add "{ctx.inputValue}"
        </div>
    );
};
