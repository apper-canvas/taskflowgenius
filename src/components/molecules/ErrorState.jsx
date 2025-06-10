import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ErrorState = ({ message, onRetry }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
        >
            <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
            <p className="text-surface-500 mb-4">{message}</p>
            <Button
                onClick={onRetry}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Try Again
            </Button>
        </motion.div>
    );
};

export default ErrorState;