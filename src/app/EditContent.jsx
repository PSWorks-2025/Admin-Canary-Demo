import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db,storage } from "../service/firebaseConfig";
import SaveFloatingButton from "../globalComponent/SaveButton";

const EditContent = () => {
  const location = useLocation();
  const { id, title: initialTitle, thumbnail: initialThumbnail } = location.state || {};

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    date: new Date().toLocaleDateString("vn-VN"),
    content: "",
    gallery: [],
    thumbnail: null,
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(initialThumbnail || null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const type = id.split("_")[0];
        const collectionName = type.charAt(0).toUpperCase() + type.slice(1);
        const docRef = doc(db, collectionName, id);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              title: data.title || initialTitle || "",
              author: data.author || "",
              date: data.date || new Date().toLocaleDateString("vn-VN"),
              content: data.content || "",
              gallery: data.gallery ? data.gallery.map((url, index) => ({
                preview: url,
                name: `Image_${index + 1}`,
              })) : [],
              thumbnail: data.thumbnail || null,
            });
            setThumbnailPreview(data.thumbnail || initialThumbnail || null);
          } else {
            setFormData({
              title: initialTitle || "",
              author: "",
              date: new Date().toLocaleDateString("vn-VN"),
              content: "",
              gallery: [],
              thumbnail: null,
            });
            setThumbnailPreview(initialThumbnail || null);
          }
        } catch (error) {
          console.error("Error fetching document:", error);
          setFormData({
            title: initialTitle || "",
            author: "",
            date: new Date().toLocaleDateString("vn-VN"),
            content: "",
            gallery: [],
            thumbnail: null,
          });
          setThumbnailPreview(initialThumbnail || null);
        }
      }
    };
    fetchData();
  }, [id, initialTitle, initialThumbnail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        console.error(`EditContent[${id}]: Selected file for thumbnail is not an image`);
        return;
      }
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        console.error(`EditContent[${id}]: File size for thumbnail exceeds 5MB`);
        return;
      }
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => {
      if (!file.type.startsWith('image/')) {
        console.error(`EditContent[${id}]: Selected file ${file.name} is not an image`);
        return null;
      }
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        console.error(`EditContent[${id}]: File size for ${file.name} exceeds 5MB`);
        return null;
      }
      return {
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      };
    }).filter(image => image !== null);
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...newImages],
    }));
  };

  const handleRemoveImage = (index) => {
    const image = formData.gallery[index];
    if (image.preview && !image.preview.startsWith('https://via.placeholder.com')) {
      const type = id.split("_")[0];
      const storagePath = `main_pages/${type}_overviews/${id}/${image.name}`;
      console.log(`EditContent[${id}]: Enqueuing deletion for gallery image: ${storagePath}`);
      deleteObject(ref(storage, storagePath)).catch((error) => {
        console.error(`EditContent[${id}]: Error deleting gallery image ${image.name}:`, error);
      });
    }
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    return () => {
      formData.gallery.forEach((image) => {
        if (image.preview && image.file) {
          URL.revokeObjectURL(image.preview);
        }
      });
      if (formData.thumbnail && thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [formData.gallery, formData.thumbnail, thumbnailPreview]);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const type = id.split("_")[0];
    const collectionName = type.charAt(0).toUpperCase() + type.slice(1);

    let thumbnailUrl = thumbnailPreview;
    if (formData.thumbnail) {
      try {
        const storagePath = `main_pages/${type}_overviews/${id}/thumbnail.jpg`;
        const storageRef = ref(storage, storagePath);
        // Delete old thumbnail if it exists and is not a placeholder
        if (thumbnailPreview && !thumbnailPreview.startsWith('https://via.placeholder.com')) {
          console.log(`EditContent[${id}]: Enqueuing deletion for thumbnail: ${storagePath}`);
          await deleteObject(storageRef).catch((error) => {
            console.error(`EditContent[${id}]: Error deleting old thumbnail:`, error);
          });
        }
        await uploadBytes(storageRef, formData.thumbnail);
        thumbnailUrl = await getDownloadURL(storageRef);
        console.log(`EditContent[${id}]: Uploaded thumbnail to ${storagePath}`);
      } catch (error) {
        console.error(`EditContent[${id}]: Error uploading thumbnail:`, error);
      }
    }

    const galleryUrls = [];
    for (const image of formData.gallery) {
      try {
        if (image.file) {
          const storagePath = `main_pages/${type}_overviews/${id}/${image.name}`;
          const storageRef = ref(storage, storagePath);
          await uploadBytes(storageRef, image.file);
          const downloadURL = await getDownloadURL(storageRef);
          galleryUrls.push(downloadURL);
          console.log(`EditContent[${id}]: Uploaded gallery image to ${storagePath}`);
        } else {
          galleryUrls.push(image.preview);
        }
      } catch (error) {
        console.error(`EditContent[${id}]: Error uploading gallery image ${image.name}:`, error);
      }
    }

    const docData = {
      title: formData.title,
      author: formData.author,
      date: formData.date,
      content: formData.content,
      gallery: galleryUrls,
      thumbnail: thumbnailUrl || "",
    };

    try {
      await setDoc(doc(db, collectionName, id), docData, { merge: true });
      console.log({
        id,
        type,
        ...docData,
      });
      console.log(`EditContent[${id}]: Document successfully written to ${collectionName}/${id}`);
    } catch (error) {
      console.error(`EditContent[${id}]: Error writing document:`, error);
    } finally {
      setIsSaving(false);
    }
  };

  function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = `${element.scrollHeight}px`;
  }

  return (
    <div className="flex justify-center min-h-screen mt-20">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-xl">
        {/* Thumbnail */}
        <div className="mb-8">
          <label className="block text-gray-700 font-medium mb-2">Thumbnail:</label>
          {thumbnailPreview ? (
            <div className="relative group mb-4">
              <img
                src={thumbnailPreview}
                alt="Thumbnail"
                className="w-full h-auto max-h-120 object-cover mx-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl"
              />
              <label className="absolute top-2 right-2 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-600 cursor-pointer" htmlFor="thumbnail">
                ✎
              </label>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
              />
            </div>
          ) : (
            <label className="custum-file-upload" htmlFor="thumbnail">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="rgba(75, 85, 99, 1)"
                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text">
                <span>Click to upload thumbnail</span>
              </div>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Form Fields */}
        <div className="text-left">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter title"
            className="w-full text-3xl font-bold mb-6 p-3 bg-transparent border-none focus:ring-0 focus:outline-none transition-colors duration-200 hover:bg-gray-50"
          />

          {/* Author */}
          <div className="flex flex-row items-center mb-4">
            <label className="block font-medium text-gray-700 mr-2">From:</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Enter author"
              className="w-full p-3 rounded-lg outline-none border border-gray-200 focus:border-gray-500 transition-colors duration-200"
            />
          </div>

          {/* Date */}
          <div className="flex flex-row items-center mb-4">
            <label className="block font-medium text-gray-700 mr-2">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-3 outline-none rounded-lg border border-gray-200 focus:border-gray-500 transition-colors duration-200"
            />
          </div>

          {/* Separator */}
          <hr className="w-full border-t-2 border-gray-500 my-3" />

          {/* Content */}
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Enter content"
            onInput={(e) => auto_grow(e.target)}
            className="w-full p-3 rounded-lg outline-none mb-8 min-h-[120px] max-h-[500px] overflow-hidden resize-none border border-gray-200 focus:border-gray-500 transition-colors duration-200"
          ></textarea>

          {/* Gallery */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">Gallery:</label>
            <label className="custum-file-upload" htmlFor="gallery">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="rgba(75, 85, 99, 1)"
                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text">
                <span>Click to upload images</span>
              </div>
              <input
                type="file"
                id="gallery"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
              />
            </label>
            {formData.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {formData.gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={image.name}
                      className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <SaveFloatingButton visible={true} onSave={handleSave} disabled={isSaving} />
      </div>
    </div>
  );
};

export default EditContent;