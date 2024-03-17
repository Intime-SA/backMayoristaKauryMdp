import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { uploadFile, db } from "../../../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";

const EditProduct = ({
  editingProductId,
  setIsEditing,
  setIsChange,
  isChange,
}) => {
  const [editedProduct, setEditedProduct] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    name: "",
  });
  const [nameError, setNameError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [unitPriceError, setUnitPriceError] = useState("");
  const [stockError, setStockError] = useState("");

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
        const categoriesData = categoriesSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() })) // Mapea los datos y asigna el ID
          .filter((category) => category.status === true); // Filtra solo las categorías con estado verdadero
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, [editingProductId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Verificar si el campo es numérico y no está vacío
    if (["unit_price", "promotional_price"].includes(name)) {
      if (value.trim() !== "") {
        newValue = parseFloat(value);
      } else {
        // Si el valor está vacío y el campo es 'stock', establecer el valor como 0
        newValue = name === "stock" ? 0 : "";
      }
    }

    if (name === "category") {
      // Obtener la categoría seleccionada a partir de su ID
      const selectedCategoryData = categories.find(
        (category) => category.id === value
      );
      setSelectedCategory(selectedCategoryData); // Establecer la categoría seleccionada
    }

    // Actualizar el estado del producto editado
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

    // Validar campos
    if (!editedProduct.name) {
      setNameError("El nombre es requerido.");
      return;
    }
    if (!selectedCategory.id) {
      setCategoryError("La categoría es requerido.");
      return;
    }
    if (!editedProduct.unit_price) {
      setUnitPriceError("El precio unitario es requerido.");
      return;
    }

    if (!editedProduct.stock && editedProduct.stock !== 0) {
      setStockError("El stock es requerido.");
      return;
    }

    // Verificar si se encontró la categoría seleccionada
    if (selectedCategory) {
      try {
        // Obtener el DocumentReference de la categoría seleccionada
        const categoryRef = doc(db, "categorys", selectedCategory.id);
        const categoryDoc = await getDoc(categoryRef);
        // Actualizar el campo 'category' del producto con el DocumentReference de la categoría seleccionada
        const updatedProduct = {
          ...editedProduct,
          category: categoryRef.id, // Aquí asignamos directamente el DocumentReference
        };

        // Obtener la referencia del documento del producto
        const productRef = doc(db, "products", editingProductId);

        // Actualizar el documento del producto en la base de datos
        await updateDoc(productRef, updatedProduct);

        // Cambiar los estados para indicar que la edición ha finalizado y que se debe actualizar la lista de productos
        setIsEditing(false);
        setIsChange(!isChange);
      } catch (error) {
        console.error("Error updating product: ", error);
      }
    } else {
      console.error("La categoría seleccionada no existe.");
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
        height: "30%",
        zoom: "0.9",
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
            {editedProduct.image ? (
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
            ) : (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/Mayorista%20Mar%20del%20Plata%20(2).png?alt=media&token=87bdf689-8eb7-49b1-9317-f6a52a9a0781"
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
              error={!!nameError}
              helperText={nameError}
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
              InputProps={{
                readOnly: true,
                style: {
                  backgroundColor: "#dddddd", // Cambia el color de fondo del campo
                  cursor: "not-allowed", // Cambia el cursor para indicar que el campo no es editable
                },
              }} // Hace que el campo sea de solo lectura
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
              error={!!stockError}
              helperText={stockError}
            />
            <TextField
              name="unit_price"
              type="number"
              variant="outlined"
              label="Precio Unitario"
              value={editedProduct.unit_price}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{ shrink: true }}
              error={!!unitPriceError}
              helperText={unitPriceError}
            />
            <TextField
              name="promotional_price"
              type="number"
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
            style={{ marginBottom: "1rem" }}
          >
            <InputLabel id="category-label" shrink>
              Categoria
            </InputLabel>
            <Select
              name="category"
              variant="outlined"
              value={selectedCategory.id}
              onChange={handleChange}
              fullWidth
              label="Categoria"
              error={!!categoryError}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {!!categoryError && (
              <FormHelperText error>{categoryError}</FormHelperText>
            )}
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
