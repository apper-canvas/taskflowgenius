import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const EmptyState = ({ iconName, title, description, buttonText, onButtonClick, className = '', motionProps = {} }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-center py-12 ${className}`}
            {...motionProps}
        >
            {iconName && (
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                >
                    <ApperIcon name={iconName} className="w-16 h-16 text-primary-300 mx-auto" />
                </motion.div>
            )}
            <h3 className="mt-4 text-lg font-display font-medium text-surface-900">{title}</h3>
            <p className="mt-2 text-surface-500">{description}</p>
            {buttonText && onButtonClick && (
                <Button
                    onClick={onButtonClick}
                    className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {buttonText}
                </Button>
            )}
        </motion.div>
    );
};

export default EmptyState;