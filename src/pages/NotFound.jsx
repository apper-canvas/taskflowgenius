import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-20"
    >
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 10, 0],
          transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }}
      >
        <ApperIcon name="Search" className="w-20 h-20 text-surface-300 mx-auto mb-6" />
      </motion.div>
      
      <h1 className="text-4xl font-display font-bold text-surface-900 mb-4">Page Not Found</h1>
      <p className="text-lg text-surface-600 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="px-6 py-3 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors font-medium"
        >
          Go Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/today')}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Go to Today
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NotFound;