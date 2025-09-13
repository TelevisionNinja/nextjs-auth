"use client";

import dynamic from 'next/dynamic';
const Select = dynamic(() => import('react-select'), { ssr: false }); // disable SSR for tree hydration error
import { useState } from 'react';
import "./select.css";

const customStyle = { // custom focus outline color
    control: (baseStyles, state) => ({
        ...baseStyles,
        border: "none",
        outline: state.isFocused ? "1px solid #000000" : "",
        boxShadow: "none",
        "&:hover": {
            border: "none",
            outline:"1px solid #000000",
            boxShadow: "none"
        }
    })
};

function handleEnter(e) {
    if (e.key === "Enter") {
        const activeElement = document.activeElement;

        if (activeElement) {
            const spaceEvent = new KeyboardEvent('keydown', {
                key: ' ',
                code: 'Space',
                bubbles: true,
                cancelable: true
            });
            activeElement.dispatchEvent(spaceEvent);
        }
    }
}

export default function ARIASelect({options}) {
    const [selectedValue, setSelectedValue] = useState(null);

    return (
        <div>
            <Select
                options={options}
                value={selectedValue}
                onChange={option => setSelectedValue(option)}
                onKeyDown={handleEnter}
                styles={customStyle}
                placeholder="Select any of these options"
                isSearchable={false}
                className="select-custom"
            />
            {(selectedValue && selectedValue.value === "chocolate") && <p>Chocolate</p>}
        </div>
    );
}
