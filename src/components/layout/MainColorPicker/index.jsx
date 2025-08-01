import ColorInput from '../../Inputs/ColorInput';
import { useState, useContext } from 'react';
import GlobalContext from '../../../GlobalContext';

const MainColorPicker = () => {
  const {
    primaryBackgroundColor,
    setPrimaryBackgroundColor,
    secondaryBackgroundColor,
    setSecondaryBackgroundColor,
    tertitaryBackgroundColor,
    setTertiaryBackgroundColor,
  } = useContext(GlobalContext);
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`relative w-full max-w-md bg-white shadow-lg rounded-t-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 transform transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <button
          onClick={toggleVisibility}
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors duration-200 z-60"
          aria-label={isVisible ? 'Hide color picker' : 'Show color picker'}
        >
          <i
            className={`fas fa-chevron-${isVisible ? 'down' : 'up'} text-base`}
          ></i>
          <span className="sr-only">{isVisible ? '↓' : '↑'}</span>
        </button>
        <label className="text-xs sm:text-sm flex items-center mt-4 sm:mt-0">
          Primary:
          <ColorInput
            type="color"
            value={primaryBackgroundColor}
            onChange={(e) => setPrimaryBackgroundColor(e.target.value)}
          />
        </label>
        <label className="text-xs sm:text-sm flex items-center">
          Secondary:
          <ColorInput
            type="color"
            value={secondaryBackgroundColor}
            onChange={(e) => setSecondaryBackgroundColor(e.target.value)}
          />
        </label>
        <label className="text-xs sm:text-sm flex items-center">
          Tertitary:
          <ColorInput
            type="color"
            value={tertitaryBackgroundColor}
            onChange={(e) => setTertiaryBackgroundColor(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export default MainColorPicker;
