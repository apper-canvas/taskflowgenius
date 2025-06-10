import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/organisms/TaskCard';
import Spinner from '@/components/atoms/Spinner';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';

const TaskList = ({
    tasks,
    categories,
    loading,
    error,
    onRetry,
    onTaskComplete,
    onTaskEdit,
    onRestoreTask,
    onPermanentDelete,
    view,
    onAddNewTaskClick
}) => {
    if (loading) {
        return (
            <div className="space-y-4 text-center">
                <Spinner className="mx-auto" />
                <p className="text-surface-500">Loading tasks...</p>
            </div>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={onRetry} />;
    }

    const getEmptyStateProps = () => {
        if (view === 'today') {
            return {
                iconName: 'CheckSquare',
                title: 'All caught up for today!',
                description: 'Take a break or add new tasks for tomorrow',
                buttonText: 'Add New Task',
                onButtonClick: onAddNewTaskClick
            };
        } else if (view === 'archive') {
            return {
                iconName: 'Archive',
                title: 'No archived tasks',
                description: 'Completed and archived tasks will appear here',
            };
        } else {
            return {
                iconName: 'CheckSquare', // default icon, could be different
                title: 'No tasks found',
                description: 'Create your first task to get started',
                buttonText: 'Add New Task',
                onButtonClick: onAddNewTaskClick
            };
        }
    };

    if (tasks.length === 0) {
        return <EmptyState {...getEmptyStateProps()} />;
    }

    const isArchivedView = view === 'archive';

    return (
        <div className="space-y-3">
            <AnimatePresence>
                {tasks.map((task, index) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        categories={categories}
                        onComplete={onTaskComplete}
                        onEdit={onTaskEdit}
                        onRestore={onRestoreTask}
                        onDeletePermanent={onPermanentDelete}
                        isArchivedView={isArchivedView}
                        index={index}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default TaskList;