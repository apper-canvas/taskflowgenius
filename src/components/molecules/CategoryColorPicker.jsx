import React from 'react';
import Label from '@/components/atoms/Label';
import Button from '@/components/atoms/Button';

const CategoryColorPicker = ({ selectedColor, onSelectColor, colorOptions }) => {
    return (
        <div>
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                    <Button
                        key={color}
                        onClick={() => onSelectColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                            selectedColor === color ? 'border-surface-900' : 'border-surface-200'
                        } p-0`}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryColorPicker;