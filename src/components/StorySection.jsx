import { motion } from "framer-motion";
import PropTypes from "prop-types";

const StorySection = ({ section }) => {
  return (
    <motion.div
      className="w-full max-w-3xl mb-8"
      initial={section.animation?.initial || { opacity: 0, y: 50 }}
      whileInView={section.animation?.animate || { opacity: 1, y: 0 }}
      transition={section.animation?.transition || { duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>

      <div
        className={`flex gap-6 ${section.layout === "textright" ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Text Content */}
        <motion.div
          className="flex-1"
          initial={section.textAnimation?.initial || { opacity: 0, x: -50 }}
          whileInView={section.textAnimation?.animate || { opacity: 1, x: 0 }}
          transition={
            section.textAnimation?.transition || { duration: 0.6, delay: 0.2 }
          }
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-700 mb-4">{section.content}</p>
        </motion.div>

        {/* Image Content */}
        {section.image && (
          <motion.div
            className="flex-1"
            initial={section.imageAnimation?.initial || { opacity: 0, x: 50 }}
            whileInView={
              section.imageAnimation?.animate || { opacity: 1, x: 0 }
            }
            transition={
              section.imageAnimation?.transition || {
                duration: 0.6,
                delay: 0.2,
              }
            }
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center">
              <img
                className="w-full rounded-lg shadow-md"
                src={section.image.src}
                alt={section.image.alt}
              />
              {section.image.caption && (
                <p className="text-sm text-gray-500 italic mt-2">
                  {section.image.caption}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

StorySection.propTypes = {
  section: PropTypes.object.isRequired,
};

export default StorySection;
