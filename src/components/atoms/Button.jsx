import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, whileHover, whileTap, ...props }) => {
    const motionProps = whileHover || whileTap ? { whileHover, whileTap } : {};

    return (
        <motion.button
            className={`transition-colors duration-200 ${className}`}
            onClick={onClick}
            {...motionProps}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;