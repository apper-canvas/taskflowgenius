import React from 'react';
import { motion } from 'framer-motion';

const ModalContent = ({ children, className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
        >
            <div className={`bg-white rounded-xl shadow-xl max-w-md w-full p-6 ${className}`}>
                {children}
            </div>
        </motion.div>
    );
};

export default ModalContent;