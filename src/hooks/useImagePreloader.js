import { useState, useEffect } from "react";

const useImagePreloader = (imageUrls) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setImagesLoaded(true);
      return;
    }

    let isMounted = true; // To prevent setting state if the component unmounts

    const loadImages = async () => {
      try {
        const imagePromises = imageUrls.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
          });
        });

        await Promise.all(imagePromises);
        if (isMounted) setImagesLoaded(true);
      } catch (error) {
        console.error("One or more images failed to load.", error);
        if (isMounted) setImagesLoaded(false);
      }
    };

    loadImages();

    return () => {
      isMounted = false; // Cleanup to prevent state update after unmount
    };
  }, [imageUrls]);

  return imagesLoaded;
};

export default useImagePreloader;
