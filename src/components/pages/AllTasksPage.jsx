import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { taskService, categoryService } from '@/services';
import TaskList from '@/components/organisms/TaskList';
import QuickAddTaskSection from '@/components/organisms/QuickAddTaskSection';

const AllTasksPage = () => {
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
            setTasks(tasksData.filter(task => !task.archived)); // Only show non-archived for 'all'
            setCategories(categoriesData);
        } catch (err) {
            setError(err.message || 'Failed to load data');
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleTaskComplete = async (taskId) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            const updatedTask = await taskService.update(taskId, {
                completed: !task.completed,
                completedAt: !task.completed ? new Date().toISOString() : null
            });
            
            setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTask : t));
            
            if (!task.completed) {
                toast.success('Task completed! 🎉');
            } else {
                toast.info('Task marked as incomplete');
            }
        } catch (err) {
            toast.error('Failed to update task');
        }
    };

    const handleAddTask = async (newTaskData) => {
        const createdTask = await taskService.create(newTaskData);
        setTasks(prevTasks => [...prevTasks, createdTask]);
        return createdTask;
    };

    // Placeholder for actual task editing modal, not part of original MainFeature logic
    const handleTaskEdit = (task) => {
        toast.info(`Editing task: "${task.title}" (modal not implemented in this refactor)`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-6">
                <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">All Tasks</h1>
                <p className="text-surface-600">View and manage all your tasks</p>
            </div>
            
            <div className="space-y-6">
                <QuickAddTaskSection onAddTask={handleAddTask} defaultCategoryId={categories[0]?.id || null} />

                <TaskList
                    tasks={tasks}
                    categories={categories}
                    loading={loading}
                    error={error}
                    onRetry={loadData}
                    onTaskComplete={handleTaskComplete}
                    onTaskEdit={handleTaskEdit}
                    view="all"
                    onAddNewTaskClick={() => { /* Quick add is already shown */ }}
                />
            </div>
        </motion.div>
    );
};

export default AllTasksPage;