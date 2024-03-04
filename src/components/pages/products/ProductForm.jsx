import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { uploadFile, db } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const ProductForm = ({
  handleClose,
  setIsChange,
  productSelected,
  setOpen,
}) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    stock: "",
    unit_price: "",
    promotional_price: "",
    image: "",
    color: "",
    talle: "",
    idc: "",
    visible: "",
    timestamp: "",
  });

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    let refCollection = collection(db, "categorys");
    getDocs(refCollection)
      .then((res) => {
        let newArray = res.docs.map((category) => {
          return { ...category.data(), id: category.id };
        });
        setCategories(newArray);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "category") {
      // Si el nombre del campo es "category", actualiza el estado de la categoría
      setSelectedCategory(e.target.value);
      setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    } else {
      // De lo contrario, actualiza el estado normalmente
      setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    }
  };

  const handleImage = async () => {
    setIsLoading(true);
    const url = await uploadFile(file);
    setNewProduct({ ...newProduct, image: url });
    setIsLoading(false);
    setIsImageUploaded(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener la categoría seleccionada
    const selectedCategory = categories.find(
      (category) => category.id === newProduct.category
    );

    // Verificar si se encontró la categoría
    if (selectedCategory) {
      try {
        // Obtener la referencia al documento de la categoría
        const categoryRef = doc(db, "categorys", selectedCategory.id);
        const categoryDoc = await getDoc(categoryRef);

        // Verificar si se encontró el documento de la categoría
        if (categoryDoc.exists()) {
          // Construir el objeto con los datos del producto y la referencia a la categoría
          const obj = {
            ...newProduct,
            stock: parseInt(newProduct.stock),
            unit_price: parseFloat(newProduct.unit_price),
            promotional_price: parseFloat(newProduct.promotional_price),
            talle: newProduct.talle,
            color: newProduct.color,
            description: newProduct.description,
            visible: true,
            idc: newProduct.idc,
            category: categoryRef, // Utilizar la referencia al documento de la categoría
            timestamp: serverTimestamp(),
          };
          console.log(obj);
          // Agregar el objeto a la colección de productos
          const productsCollection = collection(db, "products");
          const productDocRef = doc(productsCollection, newProduct.idc);

          // Agregar el objeto a la colección de productos utilizando la referencia al documento
          await setDoc(productDocRef, obj);

          // Actualizar el estado y cerrar el formulario
          setIsChange(true);
          handleClose();
        } else {
          console.error("Error: No se encontró el documento de la categoría.");
        }
      } catch (error) {
        console.error("Error adding product: ", error);
      }
    } else {
      console.error("Error: No se encontró la categoría seleccionada.");
    }
  };

  const handleReturn = () => {
    setOpen(false);
  };

  return (
    <div>
      <h5 style={{ marginTop: "1rem" }}>Agregar Producto</h5>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      ></div>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1rem",
          backgroundColor: "rgba(255, 255, 255, 0.4)", // Ajusta el último valor (0.9) para cambiar la opacidad
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <TextField
              name="name"
              variant="outlined"
              label="Nombre de Articulo"
              value={newProduct.name}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 40%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="idc"
              variant="outlined"
              label="ID en Sistema Contable"
              value={newProduct.idc}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 40%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="description"
              variant="outlined"
              label="Descripción"
              value={newProduct.description}
              onChange={handleChange}
              fullWidth
              style={{ flex: "100%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="stock"
              type="number"
              variant="outlined"
              label="Stock"
              value={newProduct.stock}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="unit_price"
              variant="outlined"
              label="Precio Unitario"
              value={newProduct.unit_price}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="promotional_price"
              variant="outlined"
              label="Precio Promocional"
              value={newProduct.promotional_price}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="talle"
              variant="outlined"
              label="Talle"
              value={newProduct.talle}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="color"
              variant="outlined"
              label="Color"
              value={newProduct.color}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              style={{ marginBottom: "1rem" }}
            >
              <InputLabel
                InputLabelProps={{ shrink: true }}
                id="category-label"
                shrink
              >
                Categoria
              </InputLabel>
              <Select
                name="category"
                variant="outlined"
                value={selectedCategory} // Suponiendo que selectedCategory es el valor seleccionado almacenado en el estado
                onChange={handleChange} // Suponiendo que handleChange actualiza el estado con el valor seleccionado
                fullWidth
                label="Categoria"
                InputLabelProps={{ shrink: true }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between", // Esto distribuirá los elementos a lo largo del contenedor
              marginTop: "1rem",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
              id="fileInput"
            />
            <label htmlFor="fileInput" style={{ marginRight: "8px" }}>
              <Button variant="contained" component="span">
                Cargar Imagen
              </Button>
            </label>
            {file && (
              <Button
                variant="contained"
                onClick={handleImage}
                disabled={isLoading}
                style={{ marginRight: "8px" }}
              >
                {isLoading ? "Cargando..." : "Subir Imagen"}
              </Button>
            )}
            {isImageUploaded && (
              <Button type="submit" variant="contained" color="success">
                Crear Producto
              </Button>
            )}
          </div>
        </form>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button variant="contained" onClick={handleReturn}>
          Volver
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
