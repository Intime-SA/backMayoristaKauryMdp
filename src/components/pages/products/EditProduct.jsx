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
  collection,
  doc,
  getDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";

const EditProduct = ({ editingProductId, setIsEditing, setIsChange }) => {
  const [editedProduct, setEditedProduct] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Obtener el documento del producto según el ID proporcionado
      const productRef = doc(db, "products", editingProductId);
      const productSnap = await getDoc(productRef);

      // Verificar si el documento existe y establecer editedProduct con los datos del producto
      if (productSnap.exists()) {
        const productData = productSnap.data();
        setEditedProduct(productData);
        setSelectedCategory(productData.category); // Establecer la categoría seleccionada del producto actual
      } else {
        console.log("No se encontró el producto con el ID proporcionado.");
      }
    };

    fetchData();

    // Obtener las categorías
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, "categorys");
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, [editingProductId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "stock" ||
      name === "unit_price" ||
      name === "talle" ||
      name === "promotional_price"
        ? parseFloat(value)
        : value;
    if (name === "category") {
      const selectedCategoryData = categories.find(
        (category) => category.id === value
      );
      setSelectedCategory(selectedCategoryData);
    }
    setEditedProduct({ ...editedProduct, [name]: newValue });
  };

  const handleImage = async () => {
    setIsLoading(true);
    const url = await uploadFile(file);
    setEditedProduct({ ...editedProduct, image: url });
    setIsLoading(false);
    setIsImageUploaded(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productRef = doc(db, "products", editingProductId);
      await updateDoc(productRef, editedProduct);
      setIsEditing(false);
      setIsChange(true);
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  const handleReturn = () => {
    setIsEditing(false);
  };

  if (!editedProduct) {
    return <div>Cargando...</div>; // Puedes mostrar un mensaje de carga mientras se obtienen los datos del producto
  }

  return (
    <div
      style={{
        marginTop: "1rem",
        paddingTop: "1rem",
        width: "100%",
      }}
    >
      <h5>Editar Producto</h5>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "1rem",
          width: "100%",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {editedProduct.image && (
              <img
                src={editedProduct.image}
                alt="Producto"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50px",
                  margin: "1rem",
                }}
              />
            )}
            <TextField
              name="name"
              variant="outlined"
              label="Nombre de Articulo"
              value={editedProduct.name}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 50%", marginTop: "3.5%" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="idc"
              variant="outlined"
              label="ID en Sistema Contable"
              value={editedProduct.idc}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 40%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="description"
              variant="outlined"
              label="Descripción"
              value={editedProduct.description}
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
              value={editedProduct.stock}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="unit_price"
              variant="outlined"
              label="Precio Unitario"
              value={editedProduct.unit_price}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="promotional_price"
              variant="outlined"
              label="Precio Promocional"
              value={editedProduct.promotional_price}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="talle"
              variant="outlined"
              label="Talle"
              value={editedProduct.talle}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="color"
              variant="outlined"
              label="Color"
              value={editedProduct.color}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
            />
          </div>
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
              value={selectedCategory.id}
              onChange={handleChange}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
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
                Actualizar Imagen
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

            <Button type="submit" variant="contained" color="success">
              Actualizar Producto
            </Button>
          </div>
        </form>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <Button variant="contained" onClick={handleReturn}>
          Cerrar
        </Button>
      </div>
    </div>
  );
};

export default EditProduct;
