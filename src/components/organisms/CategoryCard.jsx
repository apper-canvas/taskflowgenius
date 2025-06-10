import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CategoryCard = ({ category, onEdit, onDelete, index }) => {
    return (
        <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all duration-200"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: category.color }}
                    >
                        <ApperIcon name={category.icon} size={20} />
                    </div>
                    <div>
                        <h3 className="font-display font-semibold text-surface-900">{category.name}</h3>
                        <p className="text-sm text-surface-500">
                            {category.taskCount || 0} {category.taskCount === 1 ? 'task' : 'tasks'}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-1">
                    <Button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(category)}
                        className="p-2 text-surface-400 hover:text-surface-600"
                    >
                        <ApperIcon name="Edit2" size={16} />
                    </Button>
                    <Button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(category.id)}
                        className="p-2 text-surface-400 hover:text-red-500"
                    >
                        <ApperIcon name="Trash2" size={16} />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default CategoryCard;