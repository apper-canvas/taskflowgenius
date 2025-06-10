import React from 'react';

const Checkbox = ({ checked, onChange, className = '', ...props }) => {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className={`form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 cursor-pointer ${className}`}
            {...props}
        />
    );
};

export default Checkbox;