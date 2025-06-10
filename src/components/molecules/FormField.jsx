import React from 'react';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';

const FormField = ({ label, id, type = 'text', value, onChange, placeholder, children, ...props }) => {
    return (
        <div>
            {label && <Label htmlFor={id}>{label}</Label>}
            {children || (
                <Input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...props}
                />
            )}
        </div>
    );
};

export default FormField;