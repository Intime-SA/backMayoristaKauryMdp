// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import imageCompression from "browser-image-compression";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export const obtenerProductos = (callback) =>
  onSnapshot(collection(db, "products"), callback);

export const onSingIn = async ({ email, password }) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const logOut = () => {
  signOut(auth);
  console.log("Cerro Sesion");
};

export const forgotPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const uploadFile = async (file) => {
  try {
    // Comprimir la imagen antes de cargarla
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.8, // Tamaño máximo del archivo después de la compresión en MB
      maxWidthOrHeight: 800, // Ancho o alto máximo de la imagen
    });

    console.log(compressedFile);

    // Obtener una referencia al almacenamiento
    const storageRef = ref(storage, "nuevaCarpeta/" + v4());

    // Cargar la imagen comprimida en el almacenamiento

    const subida = await uploadBytes(storageRef, compressedFile);
    console.log(subida);

    // Obtener la URL de descarga de la imagen cargada
    const url = await getDownloadURL(storageRef);

    // Devolver la URL de descarga de la imagen
    return url;
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso de carga
    console.error("Error al cargar la imagen:", error);
    throw error;
  }
};
