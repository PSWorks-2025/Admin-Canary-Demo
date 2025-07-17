import React, { useRef } from "react";

export const ImageInput = ({ handleImageUpload, section, top, left, right,className,style,children }) => {
  const inputRef = useRef();

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <div onClick={triggerFileInput} className={className} style={style}>
        {children}
      </div>

    </>
  );
};
