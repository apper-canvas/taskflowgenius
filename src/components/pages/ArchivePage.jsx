import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { taskService, categoryService } from '@/services';
import TaskList from '@/components/organisms/TaskList';

const ArchivePage = () => {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [tasksData, categoriesData] = await Promise.all([
                taskService.getAll(),
                categoryService.getAll()
            ]);
            
            const archivedTasks = tasksData.filter(task => task.archived || task.completed);
            setTasks(archivedTasks);
            setCategories(categoriesData);
        } catch (err) {
            setError(err.message || 'Failed to load archived tasks');
            toast.error('Failed to load archived tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleRestoreTask = async (taskId) => {
        try {
            const updatedTask = await taskService.update(taskId, {
                archived: false,
                completed: false,
                completedAt: null
            });
            
            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
            toast.success('Task restored successfully!');
        } catch (err) {
            toast.error('Failed to restore task');
        }
    };

    const handlePermanentDelete = async (taskId) => {
        if (!window.confirm('Are you sure you want to permanently delete this task?')) {
            return;
        }

        try {
            await taskService.delete(taskId);
            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
            toast.success('Task permanently deleted');
        } catch (err) {
            toast.error('Failed to delete task');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-6">
                <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">Archive</h1>
                <p className="text-surface-600">Completed and archived tasks</p>
            </div>

            <TaskList
                tasks={tasks}
                categories={categories}
                loading={loading}
                error={error}
                onRetry={loadData}
                onRestoreTask={handleRestoreTask}
                onPermanentDelete={handlePermanentDelete}
                view="archive"
            />
        </motion.div>
    );
};

export default ArchivePage;