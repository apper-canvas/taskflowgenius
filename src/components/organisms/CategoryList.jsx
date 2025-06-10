import React from 'react';
import { AnimatePresence } from 'framer-motion';
import CategoryCard from '@/components/organisms/CategoryCard';
import Spinner from '@/components/atoms/Spinner';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CategoryList = ({ categories, loading, error, onRetry, onEditCategory, onDeleteCategory, onCreateNewCategory }) => {
    if (loading) {
        return (
            <div className="space-y-4 text-center">
                <Spinner className="mx-auto" />
                <p className="text-surface-500">Loading categories...</p>
            </div>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={onRetry} />;
    }

    if (categories.length === 0) {
        return (
            <EmptyState
                iconName="Tag"
                title="No categories yet"
                description="Create your first category to organize your tasks"
                buttonText="Create Category"
                onButtonClick={onCreateNewCategory}
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
                {categories.map((category, index) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        onEdit={onEditCategory}
                        onDelete={onDeleteCategory}
                        index={index}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default CategoryList;