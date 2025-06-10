import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';

const AllTasks = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">All Tasks</h1>
        <p className="text-surface-600">View and manage all your tasks</p>
      </div>
      
      <MainFeature view="all" />
    </motion.div>
  );
};

export default AllTasks;