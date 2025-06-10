import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { taskService, categoryService } from '../services';
import { format } from 'date-fns';

const Archive = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
  };

  const handleRestoreTask = async (taskId) => {
    try {
      const updatedTask = await taskService.update(taskId, {
        archived: false,
        completed: false,
        completedAt: null
      });
      
      setTasks(tasks.filter(t => t.id !== taskId));
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
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task permanently deleted');
    } catch (err) {
      toast.error('Failed to delete task');
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-surface-200 rounded w-3/4"></div>
              <div className="h-3 bg-surface-100 rounded w-1/2"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-surface-100 rounded w-20"></div>
                <div className="h-4 bg-surface-100 rounded w-16"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
        <p className="text-surface-500 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadData}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <ApperIcon name="Archive" className="w-16 h-16 text-surface-300 mx-auto" />
        <h3 className="mt-4 text-lg font-display font-medium text-surface-900">No archived tasks</h3>
        <p className="mt-2 text-surface-500">Completed and archived tasks will appear here</p>
      </motion.div>
    );
  }

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

      <div className="space-y-3">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-surface-200 hover:shadow-md transition-all duration-200 opacity-70"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-surface-700 line-through">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-surface-500 mt-1 break-words">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full text-white"
                        style={{ backgroundColor: getCategoryColor(task.categoryId) }}
                      >
                        {getCategoryName(task.categoryId)}
                      </span>
                      
                      {task.completedAt && (
                        <span className="text-xs text-surface-500">
                          Completed {format(new Date(task.completedAt), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRestoreTask(task.id)}
                        className="p-2 text-surface-400 hover:text-primary-600 transition-colors"
                        title="Restore task"
                      >
                        <ApperIcon name="RotateCcw" size={16} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePermanentDelete(task.id)}
                        className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                        title="Delete permanently"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Archive;