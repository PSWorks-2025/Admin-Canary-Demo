import { db, storage } from '../service/firebaseConfig.jsx';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImageToStorage = async (folder, file) => {
  if (!(file instanceof File || file instanceof Blob)) {
    console.error('Invalid file:', file);
    return null;
  }
  try {
    const storageRef = ref(storage, `${folder}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};