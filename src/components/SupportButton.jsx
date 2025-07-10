import { motion } from "framer-motion";
import PropTypes from "prop-types";

const SupportButton = ({ onClick }) => {
  return (
    <motion.button
      className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      Ủng hộ
    </motion.button>
  );
};

SupportButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default SupportButton;
