import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CategoryList from '@/components/organisms/CategoryList';
import CategoryFormModal from '@/components/organisms/CategoryFormModal';
import { categoryService, taskService } from '@/services';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [categoriesData, tasksData] = await Promise.all([
                categoryService.getAll(),
                taskService.getAll()
            ]);
            
            const categoriesWithCounts = categoriesData.map(category => ({
                ...category,
                taskCount: tasksData.filter(task => task.categoryId === category.id && !task.archived).length
            }));
            
            setCategories(categoriesWithCounts);
        } catch (err) {
            setError(err.message || 'Failed to load categories');
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSaveCategory = async (categoryData) => {
        try {
            if (categoryData.id) {
                // Update
                const updated = await categoryService.update(categoryData.id, categoryData);
                setCategories(prev => prev.map(c => c.id === updated.id ? { ...updated, taskCount: c.taskCount } : c));
                toast.success('Category updated successfully!');
            } else {
                // Create
                const created = await categoryService.create(categoryData);
                setCategories(prev => [...prev, { ...created, taskCount: 0 }]); // New category has 0 tasks
                toast.success('Category created successfully!');
            }
            setEditingCategory(null);
            setShowCreateModal(false);
        } catch (err) {
            toast.error(`Failed to ${categoryData.id ? 'update' : 'create'} category`);
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
            setCategories(prev => prev.filter(c => c.id !== categoryId));
            toast.success('Category deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete category');
        }
    };

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
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ApperIcon name="Plus" size={16} />
                    <span>New Category</span>
                </Button>
            </div>

            <CategoryList
                categories={categories}
                loading={loading}
                error={error}
                onRetry={loadData}
                onEditCategory={(cat) => setEditingCategory(cat)}
                onDeleteCategory={handleDeleteCategory}
                onCreateNewCategory={() => setShowCreateModal(true)}
            />

            {(showCreateModal || editingCategory) && (
                <CategoryFormModal
                    category={editingCategory}
                    onSave={handleSaveCategory}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingCategory(null);
                    }}
                />
            )}
        </motion.div>
    );
};

export default CategoriesPage;