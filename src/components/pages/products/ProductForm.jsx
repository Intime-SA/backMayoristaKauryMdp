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
import { addDoc, collection, getDocs } from "firebase/firestore";

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
    img: "",
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
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleImage = async () => {
    setIsLoading(true);
    const url = await uploadFile(file);
    setNewProduct({ ...newProduct, img: url });
    setIsLoading(false);
    setIsImageUploaded(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = {
      ...newProduct,
      stock: parseInt(newProduct.stock),
      unit_price: parseFloat(newProduct.unit_price),
      promotional_price: parseFloat(newProduct.promotional_price),
    };

    try {
      const productsCollection = collection(db, "productos");
      await addDoc(productsCollection, obj);
      setIsChange(true);
      handleClose();
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const handleReturn = () => {
    setOpen(false);
  };

  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });
  };

  const opciones = {
    opcion1: "Opción 1",
    opcion2: "Opción 2",
    opcion3: "Opción 3",
  };

  console.log(categories);

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
              name="name"
              variant="outlined"
              label="ID en Sistema Contable"
              value={newProduct.name}
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
