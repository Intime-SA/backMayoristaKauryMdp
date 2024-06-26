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
    imageCard: "",
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
  const [errorMessage, setErrorMessage] = useState(""); // Estado para almacenar el mensaje de error
  const [nameError, setNameError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [unitPriceError, setUnitPriceError] = useState("");
  const [stockError, setStockError] = useState("");
  const [idcError, setIdcError] = useState("");

  useEffect(() => {
    let refCollection = collection(db, "categorys");
    getDocs(refCollection)
      .then((res) => {
        let newArray = res.docs
          .map((category) => ({ ...category.data(), id: category.id })) // Mapea los datos y asigna el ID
          .filter((category) => category.status === true); // Filtra solo las categorías con estado verdadero
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
      setNewProduct({ ...newProduct, [e.target.name]: e.target.value.trim() });
    }
  };

  const handleImage = async () => {
    setIsLoading(true);

    // Subir la imagen comprimida a Firebase
    const url = await uploadFile(file);

    setNewProduct({ ...newProduct, imageCard: url });
    setIsLoading(false);
    setIsImageUploaded(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newProduct.idc) {
      setIdcError("El ID es requerido.");
      return;
    }

    if (!newProduct.name) {
      setNameError("El nombre es requerido.");
      return;
    }
    if (!newProduct.unit_price) {
      setUnitPriceError("El precio unitario es requerido.");
      return;
    }
    if (!newProduct.stock) {
      setStockError("El stock es requerido.");
      return;
    }

    const productRef = doc(db, "products", newProduct.idc);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      setErrorMessage(
        `Error: El producto con el ID ${newProduct.idc} ya existe en la base de datos.`
      );
      return; // Salir de la función si el producto ya existe
    }

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
            category: categoryRef.id, // Utilizar la referencia al documento de la categoría
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
      setCategoryError("La categoria es requerido");
      console.error("Error: No se encontró la categoría seleccionada.");
    }
  };

  const handleReturn = () => {
    setOpen(false);
  };

  return (
    <div>
      <h5 style={{ marginTop: "1rem", fontFamily: '"Kanit", sans-serif' }}>
        Completar datos > Nuevo Producto
      </h5>
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
            {isImageUploaded ? (
              <img
                src={newProduct.imageCard}
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
              value={newProduct.name}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 40%", marginBottom: "1rem" }}
              InputLabelProps={{
                shrink: true,
                style: { fontFamily: '"Kanit", sans-serif' },
              }}
              error={!!nameError}
              helperText={nameError}
              inputProps={{ style: { fontFamily: '"Kanit", sans-serif' } }}
            />
            <TextField
              name="idc"
              variant="outlined"
              label="ID en Sistema Contable"
              value={newProduct.idc}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 40%", marginBottom: "1rem" }}
              InputLabelProps={{
                shrink: true,
                style: { fontFamily: '"Kanit", sans-serif' },
              }}
              error={!!idcError}
              helperText={idcError}
              inputProps={{ style: { fontFamily: '"Kanit", sans-serif' } }}
            />
            <TextField
              name="description"
              variant="outlined"
              label="Descripción"
              value={newProduct.description}
              onChange={handleChange}
              fullWidth
              style={{ flex: "100%", marginBottom: "1rem" }}
              InputLabelProps={{
                shrink: true,
                style: { fontFamily: '"Kanit", sans-serif' },
              }}
              inputProps={{ style: { fontFamily: '"Kanit", sans-serif' } }}
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
              InputLabelProps={{
                shrink: true,
                style: { fontFamily: '"Kanit", sans-serif' },
              }}
              error={!!stockError}
              helperText={stockError}
              inputProps={{ style: { fontFamily: '"Kanit", sans-serif' } }}
            />
            <TextField
              name="unit_price"
              type="number"
              variant="outlined"
              label="Precio Unitario"
              value={newProduct.unit_price}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{
                shrink: true,
                style: { fontFamily: '"Kanit", sans-serif' },
              }}
              inputProps={{ style: { fontFamily: '"Kanit", sans-serif' } }}
              error={!!unitPriceError}
              helperText={unitPriceError}
            />
            <TextField
              name="promotional_price"
              type="number"
              variant="outlined"
              label="Precio Promocional"
              value={newProduct.promotional_price}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{
                shrink: true,
                style: { fontFamily: '"Kanit", sans-serif' },
              }}
              inputProps={{ style: { fontFamily: '"Kanit", sans-serif' } }}
            />
            <TextField
              name="talle"
              variant="outlined"
              label="Talle"
              value={newProduct.talle}
              onChange={handleChange}
              fullWidth
              style={{ flex: "1 1 20%", marginBottom: "1rem" }}
              InputLabelProps={{
                shrink: true,
                style: { fontFamily: '"Kanit", sans-serif' },
              }}
              inputProps={{ style: { fontFamily: '"Kanit", sans-serif' } }}
            />
            <TextField
              name="color"
              variant="outlined"
              label="Color"
              value={newProduct.color}
              onChange={handleChange}
              fullWidth
              style={{
                flex: "1 1 20%",
                marginBottom: "1rem",
                fontFamily: '"Kanit", sans-serif',
              }}
              InputLabelProps={{
                shrink: true,
                style: { fontFamily: '"Kanit", sans-serif' },
              }}
              inputProps={{ style: { fontFamily: '"Kanit", sans-serif' } }}
            />
            <FormControl
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
                style: { fontFamily: '"Kanit", sans-serif' },
              }}
              inputProps={{ style: { fontFamily: '"Kanit", sans-serif' } }}
              style={{
                marginBottom: "1rem",
                fontFamily: '"Kanit", sans-serif',
              }}
              s
            >
              <InputLabel
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' },
                }}
                style={{ fontFamily: '"Kanit", sans-serif' }}
                inputProps={{ style: { fontFamily: '"Kanit", sans-serif' } }}
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
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: '"Kanit", sans-serif' },
                }}
                inputProps={{ style: { fontFamily: '"Kanit", sans-serif' } }}
                error={categoryError}
                style={{ fontFamily: '"Kanit", sans-serif' }}
              >
                {categories.map((category) => (
                  <MenuItem
                    style={{
                      fontFamily: '"Kanit", sans-serif',
                    }}
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {!!categoryError && (
                <FormHelperText error>{categoryError}</FormHelperText>
              )}
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
              <Button
                style={{ fontFamily: '"Kanit", sans-serif' }}
                variant="contained"
                component="span"
              >
                Cargar Imagen
              </Button>
            </label>
            {file && (
              <Button
                variant="contained"
                onClick={handleImage}
                disabled={isLoading}
                style={{
                  marginRight: "8px",
                  fontFamily: '"Kanit", sans-serif',
                }}
              >
                {isLoading ? "Cargando..." : "Subir Imagen"}
              </Button>
            )}
            {isImageUploaded && (
              <Button
                style={{ fontFamily: '"Kanit", sans-serif' }}
                type="submit"
                variant="contained"
                color="success"
              >
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
        <Button
          style={{ fontFamily: '"Kanit", sans-serif' }}
          variant="contained"
          onClick={handleReturn}
        >
          Volver
        </Button>
      </div>
      <div>
        {errorMessage && <p>{errorMessage}</p>}
        {/* Resto del código del componente */}
      </div>
    </div>
  );
};

export default ProductForm;
