import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import QuickAddInput from '@/components/molecules/QuickAddInput';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const QuickAddTaskSection = ({ onAddTask, defaultCategoryId }) => {
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [quickTaskTitle, setQuickTaskTitle] = useState('');

    const handleAdd = async () => {
        if (!quickTaskTitle.trim()) return;

        try {
            await onAddTask({
                title: quickTaskTitle,
                description: '',
                categoryId: defaultCategoryId,
                priority: 'medium',
                dueDate: new Date().toISOString(),
                completed: false,
                archived: false
            });
            setQuickTaskTitle('');
            setShowQuickAdd(false);
            toast.success('Task added successfully!');
        } catch (err) {
            toast.error('Failed to add task');
        }
    };

    return (
        <div className="space-y-6">
            {showQuickAdd ? (
                <QuickAddInput
                    value={quickTaskTitle}
                    onChange={(e) => setQuickTaskTitle(e.target.value)}
                    onAdd={handleAdd}
                    onCancel={() => setShowQuickAdd(false)}
                />
            ) : (
                <Button
                    onClick={() => setShowQuickAdd(true)}
                    className="w-full p-4 border-2 border-dashed border-surface-300 rounded-xl text-surface-500 hover:border-primary-400 hover:text-primary-600 bg-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center justify-center space-x-2">
                        <ApperIcon name="Plus" size={20} />
                        <span className="font-medium">Add new task</span>
                    </div>
                </Button>
            )}
        </div>
    );
};

export default QuickAddTaskSection;