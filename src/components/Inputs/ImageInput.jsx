import React, { useRef } from 'react';

export const ImageInput = ({
  imagePreview,
  handleImageUpload,
  className,
  style,
}) => {
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
        {
          <img
            src={
              imagePreview ||
              'https://blog.photobucket.com/hubfs/upload_pics_online.png'
            }
            alt="Preview"
            className="w-full h-full object-cover"
          />
        }
      </div>
    </>
  );
};
