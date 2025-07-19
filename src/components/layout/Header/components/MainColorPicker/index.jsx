import ColorInput from '../../../../Inputs/ColorInput';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const MainColorPicker = ({
  globalData,
  setPrimaryBackgroundColor,
  setSecondaryBackgroundColor,
  setTertiaryBackgroundColor,
  debouncedUpdateGlobalData,
  secondaryBackgroundColor,
  tertiaryBackgroundColor
}) => {
  const [bg, setBg] = useState(globalData?.primaryBackgroundColor || '#ffffff');

  useEffect(() => {
    setPrimaryBackgroundColor(bg);
    debouncedUpdateGlobalData({ primaryBackgroundColor: bg });
  }, [bg]);

  return (
    <div className="absolute top-7 right-2 flex items-center justify-center space-x-2">
      <label className="text-sm">
        Background color:
        <ColorInput
          type="color"
          value={bg}
          onChange={(e) => setBg(e.target.value)}
          className="ml-1 w-6 h-6"
        />
      </label>
      <label className="text-sm">
        Header and button:
        <ColorInput
          type="color"
          value={secondaryBackgroundColor}
          onChange={(e) => {
            setSecondaryBackgroundColor(e.target.value);
            debouncedUpdateGlobalData({ secondaryBackgroundColor: e.target.value });
          }}
          className="ml-1 w-6 h-6"
        />
      </label>
      <label className="text-sm">
        Footer:
        <ColorInput
          type="color"
          value={tertiaryBackgroundColor}
          onChange={(e) => {
            setTertiaryBackgroundColor(e.target.value);
            debouncedUpdateGlobalData({ tertiaryBackgroundColor: e.target.value });
          }}
          className="ml-1 w-6 h-6"
        />
      </label>
    </div>
  );
};

MainColorPicker.propTypes = {
  globalData: PropTypes.object,
  setPrimaryBackgroundColor: PropTypes.func,
  setSecondaryBackgroundColor: PropTypes.func,
  setTertiaryBackgroundColor: PropTypes.func,
  debouncedUpdateGlobalData: PropTypes.func,
  secondaryBackgroundColor: PropTypes.string,
  tertiaryBackgroundColor: PropTypes.string,
};

export default MainColorPicker;
