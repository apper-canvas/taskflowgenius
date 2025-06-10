import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Label from '@/components/atoms/Label';
import Button from '@/components/atoms/Button';

const IconPicker = ({ selectedIcon, onSelectIcon, iconOptions }) => {
    return (
        <div>
            <Label>Icon</Label>
            <div className="grid grid-cols-6 gap-2">
                {iconOptions.map((icon) => (
                    <Button
                        key={icon}
                        onClick={() => onSelectIcon(icon)}
                        className={`p-2 rounded-lg border ${
                            selectedIcon === icon
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-surface-200 hover:bg-surface-50'
                        }`}
                    >
                        <ApperIcon name={icon} size={16} />
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default IconPicker;