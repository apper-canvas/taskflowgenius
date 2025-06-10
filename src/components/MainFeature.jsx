import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { taskService, categoryService } from '../services';
import { format, isToday, isTomorrow, isThisWeek, isAfter, startOfDay } from 'date-fns';

const MainFeature = ({ view = 'today', searchQuery = '' }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickTaskTitle, setQuickTaskTitle] = useState('');

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
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = (tasks) => {
    let filteredTasks = tasks.filter(task => !task.archived);

    // Apply view filter
    switch (view) {
      case 'today':
        filteredTasks = filteredTasks.filter(task => 
          task.dueDate && isToday(new Date(task.dueDate))
        );
        break;
      case 'upcoming':
        filteredTasks = filteredTasks.filter(task => 
          task.dueDate && isAfter(new Date(task.dueDate), startOfDay(new Date()))
        );
        break;
      case 'completed':
        filteredTasks = filteredTasks.filter(task => task.completed);
        break;
      case 'archive':
        filteredTasks = tasks.filter(task => task.archived);
        break;
      default:
        break;
    }

    // Apply search filter
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredTasks;
  };

  const handleTaskComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      });
      
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      
      if (!task.completed) {
        toast.success('Task completed! 🎉');
      } else {
        toast.info('Task marked as incomplete');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleQuickAdd = async () => {
    if (!quickTaskTitle.trim()) return;

    try {
      const newTask = await taskService.create({
        title: quickTaskTitle,
        description: '',
        categoryId: categories[0]?.id || null,
        priority: 'medium',
        dueDate: new Date().toISOString(),
        completed: false,
        archived: false
      });

      setTasks([...tasks, newTask]);
      setQuickTaskTitle('');
      setShowQuickAdd(false);
      toast.success('Task added successfully!');
    } catch (err) {
      toast.error('Failed to add task');
    }
  };

  const handleTaskEdit = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-accent-500 bg-accent-50';
      case 'low': return 'border-l-surface-300 bg-surface-50';
      default: return 'border-l-surface-300 bg-white';
    }
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

  const filteredTasks = filterTasks(tasks);
  const completedTasks = tasks.filter(t => t.completed && !t.archived).length;
  const totalTasks = tasks.filter(t => !t.archived).length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

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

  if (filteredTasks.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="CheckSquare" className="w-16 h-16 text-primary-300 mx-auto" />
        </motion.div>
        <h3 className="mt-4 text-lg font-display font-medium text-surface-900">
          {view === 'today' ? 'All caught up for today!' : 'No tasks found'}
        </h3>
        <p className="mt-2 text-surface-500">
          {view === 'today' 
            ? 'Take a break or add new tasks for tomorrow'
            : 'Create your first task to get started'
          }
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQuickAdd(true)}
          className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Add New Task
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      {view === 'today' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-semibold text-surface-900">Today's Progress</h2>
              <p className="text-surface-500">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-200"
                  strokeDasharray="100, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  className="text-primary-600 progress-ring"
                  strokeDasharray={`${completionPercentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-surface-900">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Add */}
      <AnimatePresence>
        {showQuickAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-surface-200 overflow-hidden"
          >
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={quickTaskTitle}
                onChange={(e) => setQuickTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuickAdd()}
                className="flex-1 px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuickAdd}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add
              </motion.button>
              <button
                onClick={() => setShowQuickAdd(false)}
                className="px-3 py-2 text-surface-500 hover:text-surface-700 transition-colors"
              >
                <ApperIcon name="X" size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Task Button */}
      {!showQuickAdd && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowQuickAdd(true)}
          className="w-full p-4 border-2 border-dashed border-surface-300 rounded-xl text-surface-500 hover:border-primary-400 hover:text-primary-600 transition-all duration-200 bg-white"
        >
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="Plus" size={20} />
            <span className="font-medium">Add new task</span>
          </div>
        </motion.button>
      )}

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl p-4 shadow-sm border-l-4 hover:shadow-md transition-all duration-200 cursor-pointer ${getPriorityColor(task.priority)} ${
                task.completed ? 'opacity-60' : ''
              }`}
              onClick={() => handleTaskEdit(task)}
            >
              <div className="flex items-start space-x-3">
                {/* Checkbox */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskComplete(task.id);
                  }}
                  className="mt-1"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="task-checkbox"
                  />
                </motion.button>

                {/* Task Content */}
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
                    <div className="flex items-center space-x-2">
                      {/* Category */}
                      {task.categoryId && (
                        <span
                          className="px-2 py-1 text-xs font-medium rounded-full text-white"
                          style={{ backgroundColor: getCategoryColor(task.categoryId) }}
                        >
                          {categories.find(c => c.id === task.categoryId)?.name}
                        </span>
                      )}
                      
                      {/* Priority */}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-accent-100 text-accent-700' :
                        'bg-surface-100 text-surface-600'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Due Date */}
                    {task.dueDate && (
                      <div className="flex items-center space-x-1 text-sm text-surface-500">
                        <ApperIcon name="Calendar" size={14} />
                        <span>{formatDueDate(task.dueDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainFeature;