import React from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const QuickAddInput = ({ value, onChange, onAdd, onCancel }) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onAdd();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-surface-200 overflow-hidden"
        >
            <div className="flex space-x-3">
                <Input
                    type="text"
                    placeholder="What needs to be done?"
                    value={value}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                    autoFocus
                />
                <Button
                    onClick={onAdd}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Add
                </Button>
                <Button
                    onClick={onCancel}
                    className="px-3 py-2 text-surface-500 hover:text-surface-700"
                >
                    <ApperIcon name="X" size={16} />
                </Button>
            </div>
        </motion.div>
    );
};

export default QuickAddInput;