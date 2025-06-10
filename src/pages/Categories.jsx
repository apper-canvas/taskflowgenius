import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { categoryService, taskService } from '../services';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#5B21B6',
    icon: 'Tag'
  });

  const colorOptions = [
    '#5B21B6', '#3B82F6', '#10B981', '#F59E0B',
    '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'
  ];

  const iconOptions = [
    'Tag', 'Briefcase', 'Code', 'Users', 'User', 'Home',
    'Star', 'Heart', 'Zap', 'Target', 'Calendar', 'Clock'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ]);
      
      // Update task counts
      const categoriesWithCounts = categoriesData.map(category => ({
        ...category,
        taskCount: tasksData.filter(task => task.categoryId === category.id && !task.archived).length
      }));
      
      setCategories(categoriesWithCounts);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const created = await categoryService.create(newCategory);
      setCategories([...categories, created]);
      setNewCategory({ name: '', color: '#5B21B6', icon: 'Tag' });
      setShowCreateModal(false);
      toast.success('Category created successfully!');
    } catch (err) {
      toast.error('Failed to create category');
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const updated = await categoryService.update(editingCategory.id, {
        name: editingCategory.name,
        color: editingCategory.color,
        icon: editingCategory.icon
      });
      
      setCategories(categories.map(c => c.id === updated.id ? { ...updated, taskCount: c.taskCount } : c));
      setEditingCategory(null);
      toast.success('Category updated successfully!');
    } catch (err) {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (category?.taskCount > 0) {
      toast.error('Cannot delete category with existing tasks');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await categoryService.delete(categoryId);
      setCategories(categories.filter(c => c.id !== categoryId));
      toast.success('Category deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
          >
            <div className="animate-pulse flex items-center space-x-4">
              <div className="w-12 h-12 bg-surface-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-200 rounded w-1/4"></div>
                <div className="h-3 bg-surface-100 rounded w-1/6"></div>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">Categories</h1>
          <p className="text-surface-600">Organize your tasks with custom categories</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>New Category</span>
        </motion.button>
      </div>

      {categories.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <ApperIcon name="Tag" className="w-16 h-16 text-primary-300 mx-auto" />
          <h3 className="mt-4 text-lg font-display font-medium text-surface-900">No categories yet</h3>
          <p className="mt-2 text-surface-500">Create your first category to organize your tasks</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Create Category
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {categories.map((category, index) => (
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
                        {category.taskCount} {category.taskCount === 1 ? 'task' : 'tasks'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingCategory({ ...category })}
                      className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Category Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-display font-semibold text-surface-900 mb-4">Create Category</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Category name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Color</label>
                    <div className="flex space-x-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewCategory({ ...newCategory, color })}
                          className={`w-8 h-8 rounded-full border-2 ${
                            newCategory.color === color ? 'border-surface-900' : 'border-surface-200'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Icon</label>
                    <div className="grid grid-cols-6 gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setNewCategory({ ...newCategory, icon })}
                          className={`p-2 rounded-lg border ${
                            newCategory.icon === icon
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-surface-200 hover:bg-surface-50'
                          }`}
                        >
                          <ApperIcon name={icon} size={16} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-surface-200 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateCategory}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Create
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {editingCategory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setEditingCategory(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-display font-semibold text-surface-900 mb-4">Edit Category</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Category name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Color</label>
                    <div className="flex space-x-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setEditingCategory({ ...editingCategory, color })}
                          className={`w-8 h-8 rounded-full border-2 ${
                            editingCategory.color === color ? 'border-surface-900' : 'border-surface-200'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Icon</label>
                    <div className="grid grid-cols-6 gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setEditingCategory({ ...editingCategory, icon })}
                          className={`p-2 rounded-lg border ${
                            editingCategory.icon === icon
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-surface-200 hover:bg-surface-50'
                          }`}
                        >
                          <ApperIcon name={icon} size={16} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="flex-1 px-4 py-2 border border-surface-200 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpdateCategory}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Update
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Categories;