import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../service/firebaseConfig";
import SaveFloatingButton from "../globalComponent/SaveButton";

const EditContent = () => {
  const location = useLocation();
  const { id, title: initialTitle, thumbnail } = location.state || {};

  const [formData, setFormData] = useState({
    title: initialTitle || "",
    author: "",
    date: new Date().toLocaleDateString("vn-VN"),
    content: "",
    gallery: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...newImages],
    }));
  };

  // Cleanup preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      formData.gallery.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [formData.gallery]);

  const handleSave = async () => {
    const type = id.split("_")[0];
    const collectionName = type.charAt(0).toUpperCase() + type.slice(1);

    const galleryUrls = [];
    for (const image of formData.gallery) {
      try {
        const storagePath = `${type}s/${id}/${image.name}`; 
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, image.file);
        const downloadURL = await getDownloadURL(storageRef);
        galleryUrls.push(downloadURL);
      } catch (error) {
        console.error(`Error uploading image ${image.name}:`, error);
      }
    }

    const docData = {
      title: formData.title,
      author: formData.author,
      date: formData.date,
      content: formData.content,
      gallery: galleryUrls, 
      thumbnail: thumbnail || "", 
    };

    try {
      await setDoc(doc(db, collectionName, id), docData, { merge: true });
      console.log({
        id,
        type,
        ...formData,
        gallery: galleryUrls, // Log download URLs
      });
      console.log(`Document successfully written to ${collectionName}/${id}`);
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = `${element.scrollHeight}px`;
  }

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        {/* Thumbnail */}
        {thumbnail ? (
          <img
            src={thumbnail}
            alt="Thumbnail"
            className="w-[70%] h-auto mx-auto mb-8 rounded-lg shadow-md"
          />
        ) : (
          <div className="w-[70%] h-64 mx-auto mb-8 bg-green-100 flex items-center justify-center rounded-lg shadow-md">
            <span className="text-green-700 font-medium">No Thumbnail</span>
          </div>
        )}

        {/* Form Fields */}
        {/* Mister lonely */}
        <div className="text-left">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter title"
            className="w-full text-3xl font-bold mb-6 p-3 bg-transparent border-none focus:ring-0"
          />

          {/* Author */}
          <div className="flex flex-row items-center">
            <label className="block font-medium">From:</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Enter author"
              className="w-full p-3 rounded-lg outline-none"
            />
          </div>

          {/* Date */}
          <div className="flex flex-row items-center">
            <label className="block font-medium">Date:</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              readOnly
              className="w-full p-3 outline-none rounded-lg"
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
            className="w-full p-3 rounded-lg outline-none mb-8 min-h-[120px] max-h-[500px] overflow-hidden resize-none"
          ></textarea>

          {/* Gallery */}
          <div className="mb-8">
            <label className="block text-green-700 font-medium mb-2">Gallery:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryUpload}
              className="w-full p-3 bg-green-50 rounded-lg border-none text-green-800 file:bg-green-200 file:border-none file:rounded-lg file:px-4 file:py-2 file:text-green-800 file:cursor-pointer"
            />
            {formData.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {formData.gallery.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview}
                      alt={image.name}
                      className="w-full h-45 object-cover rounded-lg shadow-sm"
                    />
                    <span className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                      {image.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <SaveFloatingButton onClick={handleSave} />
    </div>
  );
};

export default EditContent;