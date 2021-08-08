import React from "react";

const MySwitch = ({ checked, onChange }) => {
    return (
        <button onClick={() => onChange && onChange(!checked)}>
            {checked ? "on" : "off"}
        </button>
    );
};

export default MySwitch;
