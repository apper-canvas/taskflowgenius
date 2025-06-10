import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ModalOverlay from '@/components/atoms/ModalOverlay';
import ModalContent from '@/components/atoms/ModalContent';
import FormField from '@/components/molecules/FormField';
import CategoryColorPicker from '@/components/molecules/CategoryColorPicker';
import IconPicker from '@/components/molecules/IconPicker';
import Button from '@/components/atoms/Button';
import { toast } from 'react-toastify';

const colorOptions = [
    '#5B21B6', '#3B82F6', '#10B981', '#F59E0B',
    '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'
];

const iconOptions = [
    'Tag', 'Briefcase', 'Code', 'Users', 'User', 'Home',
    'Star', 'Heart', 'Zap', 'Target', 'Calendar', 'Clock'
];

const CategoryFormModal = ({ category = null, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        color: colorOptions[0],
        icon: iconOptions[0]
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                color: category.color,
                icon: category.icon
            });
        } else {
            setFormData({ name: '', color: colorOptions[0], icon: iconOptions[0] });
        }
    }, [category]);

    const handleChange = (e) => {
        setFormData({ ...formData, name: e.target.value });
    };

    const handleColorChange = (color) => {
        setFormData({ ...formData, color });
    };

    const handleIconChange = (icon) => {
        setFormData({ ...formData, icon });
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            toast.error('Category name is required');
            return;
        }
        onSave(category ? { ...category, ...formData } : formData);
    };

    return (
        <AnimatePresence>
            <ModalOverlay onClick={onClose} />
            <ModalContent>
                <h2 className="text-xl font-display font-semibold text-surface-900 mb-4">
                    {category ? 'Edit Category' : 'Create Category'}
                </h2>
                
                <div className="space-y-4">
                    <FormField
                        label="Name"
                        id="category-name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Category name"
                    />

                    <CategoryColorPicker
                        selectedColor={formData.color}
                        onSelectColor={handleColorChange}
                        colorOptions={colorOptions}
                    />

                    <IconPicker
                        selectedIcon={formData.icon}
                        onSelectIcon={handleIconChange}
                        iconOptions={iconOptions}
                    />
                </div>

                <div className="flex space-x-3 mt-6">
                    <Button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-surface-200 text-surface-700 rounded-lg hover:bg-surface-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {category ? 'Update' : 'Create'}
                    </Button>
                </div>
            </ModalContent>
        </AnimatePresence>
    );
};

export default CategoryFormModal;