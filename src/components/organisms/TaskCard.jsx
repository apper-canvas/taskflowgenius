import React from 'react';
import { motion } from 'framer-motion';
import Checkbox from '@/components/atoms/Checkbox';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { format, isToday, isTomorrow, isThisWeek, isAfter, startOfDay } from 'date-fns';

const TaskCard = ({
    task,
    categories,
    onComplete,
    onEdit,
    onRestore,
    onDeletePermanent,
    isArchivedView = false,
    index
}) => {
    const getPriorityColorClass = (priority) => {
        switch (priority) {
            case 'high': return 'border-l-red-500 bg-red-50';
            case 'medium': return 'border-l-accent-500 bg-accent-50';
            case 'low': return 'border-l-surface-300 bg-surface-50';
            default: return 'border-l-surface-300 bg-white';
        }
    };

    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700';
            case 'medium': return 'bg-accent-100 text-accent-700';
            case 'low': return 'bg-surface-100 text-surface-600';
            default: return 'bg-surface-100 text-surface-600';
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.name || 'Uncategorized';
    };

    const getCategoryColor = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.color || '#6B7280';
    };

    const formatDueDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        if (isThisWeek(date)) return format(date, 'EEEE');
        return format(date, 'MMM d');
    };

    return (
        <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-xl p-4 shadow-sm border-l-4 hover:shadow-md transition-all duration-200 ${
                getPriorityColorClass(task.priority)
            } ${
                task.completed && !isArchivedView ? 'opacity-60' : ''
            } ${isArchivedView ? 'opacity-70' : 'cursor-pointer'}`}
            onClick={isArchivedView ? null : () => onEdit(task)}
        >
            <div className="flex items-start space-x-3">
                {!isArchivedView && (
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onComplete(task.id);
                        }}
                        className="mt-1 p-0 bg-transparent hover:bg-transparent"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Checkbox
                            checked={task.completed}
                            onChange={() => {}} // Controlled by button onClick
                            className="task-checkbox"
                        />
                    </Button>
                )}

                <div className="flex-1 min-w-0">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-surface-500' : 'text-surface-900'}`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="text-sm text-surface-500 mt-1 break-words">
                            {task.description}
                        </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center flex-wrap gap-2">
                            {task.categoryId && (
                                <span
                                    className="px-2 py-1 text-xs font-medium rounded-full text-white"
                                    style={{ backgroundColor: getCategoryColor(task.categoryId) }}
                                >
                                    {getCategoryName(task.categoryId)}
                                </span>
                            )}
                            
                            {!isArchivedView && task.priority && (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                                    {task.priority}
                                </span>
                            )}

                            {isArchivedView && task.completedAt && (
                                <span className="text-xs text-surface-500">
                                    Completed {format(new Date(task.completedAt), 'MMM d, yyyy')}
                                </span>
                            )}
                        </div>

                        {!isArchivedView && task.dueDate && (
                            <div className="flex items-center space-x-1 text-sm text-surface-500">
                                <ApperIcon name="Calendar" size={14} />
                                <span>{formatDueDate(task.dueDate)}</span>
                            </div>
                        )}

                        {isArchivedView && (
                            <div className="flex items-center space-x-2">
                                <Button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onRestore(task.id)}
                                    className="p-2 text-surface-400 hover:text-primary-600"
                                    title="Restore task"
                                >
                                    <ApperIcon name="RotateCcw" size={16} />
                                </Button>
                                
                                <Button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onDeletePermanent(task.id)}
                                    className="p-2 text-surface-400 hover:text-red-500"
                                    title="Delete permanently"
                                >
                                    <ApperIcon name="Trash2" size={16} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;