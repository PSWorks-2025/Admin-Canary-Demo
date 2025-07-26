import { useState, useEffect } from "react";

const FALLBACK_IMAGE_URL = "https://blog.photobucket.com/hubfs/upload_pics_online.png";

const useImagePreloader = (imageUrls) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      // Handle empty or invalid imageUrls
      if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        if (isMounted) setImagesLoaded(true);
        return;
      }

      // Sanitize URLs with fallback
      const sanitizedUrls = imageUrls.map((url) =>
        url && typeof url === 'string' && url.trim() !== '' ? url : FALLBACK_IMAGE_URL
      );

      try {
        const imagePromises = sanitizedUrls.map((src, index) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(true);
            img.onerror = () => {
              console.warn(`Image failed to load: ${src} (index: ${index}). Using fallback.`);
              resolve(true); // Continue with fallback
            };
          });
        });

        await Promise.all(imagePromises);
        if (isMounted) setImagesLoaded(true);
      } catch (error) {
        console.error("Unexpected error in image preloader:", error);
        if (isMounted) setImagesLoaded(true); // Allow rendering on errors
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [imageUrls]);

  return imagesLoaded;
};

export default useImagePreloader;