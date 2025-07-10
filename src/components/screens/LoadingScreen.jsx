import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 min-h-[70vh]">
      {/* Spinner Animation */}
      <motion.div
        className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />

      {/* Loading Text */}
      <motion.div
        className="text-lg text-gray-600"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Loading content... ✨
      </motion.div>

      {/* Dots Animation */}
      <motion.div
        className="flex space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-600 rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
