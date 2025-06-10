import React from 'react';
import { motion } from 'framer-motion';
import ProgressRing from '@/components/molecules/ProgressRing';

const ProgressSummaryCard = ({ completedTasks, totalTasks }) => {
    const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
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
                <ProgressRing percentage={completionPercentage} size={16} strokeWidth={2} />
            </div>
        </motion.div>
    );
};

export default ProgressSummaryCard;