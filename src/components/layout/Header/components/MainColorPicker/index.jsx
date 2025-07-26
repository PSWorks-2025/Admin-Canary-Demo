import ColorInput from '../../../../Inputs/ColorInput';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const MainColorPicker = ({
  primaryBackgroundColor,
  secondaryBackgroundColor,
  tertiaryBackgroundColor,
  setPrimaryBackgroundColor,
  setSecondaryBackgroundColor,
  setTertiaryBackgroundColor,
}) => {

  return (
    <div className="absolute top-7 right-2 flex items-center justify-center space-x-2">
      <label className="text-sm">
        Background color:
        <ColorInput
          type="color"
          value={primaryBackgroundColor}
          onChange={(e) => setPrimaryBackgroundColor(e.target.value)}
          className="ml-1 w-6 h-6"
        />
      </label>
      <label className="text-sm">
        Header and button:
        <ColorInput
          type="color"
          value={secondaryBackgroundColor}
          onChange={(e) => setSecondaryBackgroundColor(e.target.value)}
          className="ml-1 w-6 h-6"
        />
      </label>
      <label className="text-sm">
        Footer:
        <ColorInput
          type="color"
          value={tertiaryBackgroundColor}
          onChange={(e) => setTertiaryBackgroundColor(e.target.value)}
          className="ml-1 w-6 h-6"
        />
      </label>
    </div>
  );
};

MainColorPicker.propTypes = {
  globalData: PropTypes.object,
  primaryBackgroundColor: PropTypes.string,
  secondaryBackgroundColor: PropTypes.string,
  tertiaryBackgroundColor: PropTypes.string,
  setPrimaryBackgroundColor: PropTypes.func,
  setSecondaryBackgroundColor: PropTypes.func,
  setTertiaryBackgroundColor: PropTypes.func,
};

export default MainColorPicker;