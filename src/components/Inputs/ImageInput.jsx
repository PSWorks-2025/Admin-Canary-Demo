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

  // Fallback if preview is invalid or cannot be loaded
  const isValidImageUrl = (url) => {
    return typeof url === 'string' &&
      (url.startsWith('blob:') || url.startsWith('http') || url.startsWith('/'));
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
        <img
          src={
            isValidImageUrl(imagePreview)
              ? imagePreview
              : 'https://blog.photobucket.com/hubfs/upload_pics_online.png'
          }
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>
    </>
  );
};
