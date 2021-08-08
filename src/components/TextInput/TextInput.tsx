//
import cn from "classnames";
import React from "react";

//
export const TextInput = (props: any) => {
    //
    const {
        type,
        value,
        innerRef,
        //
        onBlur,
        onFocus,
        onChange,
        onInput,
        onKeyPress,
        //
        ...otherProps
    } = props;

    const _onChange = (event: any) =>
        onChange && onChange(event.target.value, event);

    return (
        <input
            ref={innerRef}
            type={type || "text"}
            value={value}
            onBlur={onBlur}
            onFocus={onFocus}
            onInput={onInput}
            onChange={_onChange}
            onKeyPress={onKeyPress}
            className={cn(
                "focus:ring-indigo-500 focus:border-indigo-500",
                "block w-full sm:text-sm border-gray-200 border-solid rounded-md border"
            )}
            {...otherProps}
        />
    );
};

export const TextInputWithRef = React.forwardRef(TextInput);
