import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import ItemListDetail from "./ItemListDetail";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ProductForm from "./ProductForm";
import * as XLSX from "xlsx";
import axios from "axios";
import { productsCollection } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const ItemListContainer = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // Número de productos por página
  const [isChange, setIsChange] = useState(false);
  const [productSelected, setProductSelected] = useState({});
  const [open, setOpen] = useState(false);
  const [estado, setEstado] = useState(false);
  const [showContagramBtn, setShowContagramBtn] = useState(false); // Nuevo estado para controlar la visibilidad del botón "Actualizar desde Contagram"
  const [nonEmptyRecordsLength, setNonEmptyRecordsLength] = useState(0);
  const [updatedRecordsCount, setUpdatedRecordsCount] = useState(0);
  const [productsTotal, setProductsTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [postUpdate, setPostUpdate] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const productsRef = collection(db, "products");
      const querySnapshot = await getDocs(productsRef);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProducts(data);
      setFilteredProducts(data); // Inicialmente, establecemos los productos filtrados como todos los productos
      setLoading(false);
    };

    fetchProducts();
  }, [isChange]);

  useEffect(() => {
    if (products) {
      setProductsTotal(products.length);
    }
  }, [products, postUpdate]);

  // Calcular índices del primer y último producto en la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (product) => {
    setProductSelected(product);
    setOpen(true);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "80vh",
    width: "80vw",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const importarDatos = async () => {
    try {
      const response = await axios.get("../../../products.json");
      const dataProductos = response.data;

      for (const elemento of dataProductos) {
        // Obtener el valor de idc y luego eliminarlo del objeto
        const idc = elemento.idc.toString();

        // Crear una referencia de documento utilizando el valor de idc como ID del documento
        const productDocRef = doc(productsCollection, idc);

        // Agregar el elemento como un documento utilizando la referencia de documento
        await setDoc(productDocRef, elemento);
        console.log("Documento agregado exitosamente con ID:", idc);
      }

      console.log("Importación de datos completada.");
    } catch (error) {
      console.error("Error al importar datos:", error);
    }
  };

  const exportToExcel = () => {
    const data = filteredProducts.map((producto) => {
      const unitPrice = parseFloat(producto.unit_price.toFixed(2));

      console.log(producto.category);

      // Realiza la validación para asegurarte de que unitPrice sea un número
      if (isNaN(unitPrice)) {
        // Muestra una alerta en caso de que unitPrice no sea un número
        alert(
          `Error: El precio del producto ${producto.name} no es un número válido.`
        );
        return null; // O puedes manejarlo de otra manera, como omitir esta fila de datos
      }

      const filaPedido = [
        producto.category.id,
        producto.idc,
        producto.image,
        producto.talle,
        producto.color,
        producto.name,
        producto.visible,
        producto.stock,
        producto.description,
        unitPrice,
        producto.promotional_price,
      ];
      return filaPedido;
    });

    const header = [
      "Categoria",
      "ID",
      "URL Imagen",
      "Talle",
      "Color",
      "Nombre",
      "Visibilidad",
      "Stock",
      "Description",
      "Precio",
      "Precio Promocional",
    ];

    const wsData = [header, ...data];
    // wsData[0].push(...productHeaders); // Agrega los encabezados de productos al encabezado principal

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MiHojaDeCalculo");
    XLSX.writeFile(wb, "Productos.xlsx");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setEstado(true);
      setShowContagramBtn(true); // Mostrar el botón "Actualizar desde Contagram" al cargar el archivo
    }

    if (!file) {
      return; // Salir si no se seleccionó un archivo
    }

    try {
      const excelData = await parseExcelFile(file);
      await updateFirebaseProducts(excelData);
      reloadUpdatedProducts();
    } catch (error) {
      console.error("Error al procesar el archivo Excel", error);
    }
  };

  const parseExcelFile = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          range: 2,
        }); // Ignora las dos primeras filas
        resolve(excelData);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const updateFirebaseProducts = async (excelData) => {
    const productsRef = collection(db, "products");
    const nonEmptyRecords = excelData.filter((row) => row.length > 0);
    setNonEmptyRecordsLength(nonEmptyRecords.length - 1);

    for (const rowData of excelData.slice(1)) {
      // Ignora la primera fila (encabezados)
      const productId = rowData[1] !== undefined ? rowData[1].toString() : ""; // Supongamos que la primera columna es el ID del producto
      const unitPrice = rowData[5];
      const stock = rowData[6]; // Obtén el valor de unit_price desde el archivo Excel

      // Busca el producto en el objeto products
      const productToUpdate = products.find(
        (product) => product.id === productId
      );
      console.log(productToUpdate);
      // Verifica si el producto existe en el objeto products y si los datos son diferentes
      if (
        productToUpdate &&
        (productToUpdate.unit_price !== unitPrice ||
          productToUpdate.stock !== stock)
      ) {
        const updatedData = {
          unit_price: unitPrice,
          stock: stock,
          // Otros campos...
        };
        console.log(updatedData);
        const productDocRef = doc(productsRef, productId);

        try {
          await updateDoc(productDocRef, updatedData);
          setUpdatedRecordsCount((prevCount) => prevCount + 1);
        } catch (error) {
          console.error("Error al actualizar el producto", error);
        }
      }
    }
    setEstado(false);
    setShowContagramBtn(false);
    setPostUpdate(true);
  };

  const reloadUpdatedProducts = async () => {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);
    const updatedProducts = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts); // Actualiza los productos filtrados con los productos actualizados
  };

  const style2 = {
    position: "absolute",
    top: "23.5rem",
    marginLeft: "6rem",
    transform: "translate(-50%, -50%)",
    width: "40vw",
    height: "28rem",
    bgcolor: "background.paper",
    border: "2px solid rgba(0, 0, 0, 0.2)", // Ajusta el grosor y color del borde
    borderRadius: "10px", // Ajusta el radio de borde
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Ajusta la sombra
    p: 4,
    backgroundColor: "rgba(255, 255, 255)",
    zIndex: "9999", // Ajusta el valor de zIndex para asegurar que esté por encima de otros elementos
  };

  const fileInputRef = useRef(null);

  const handleClick = () => {
    // Simula un clic en el input de archivo cuando se hace clic en el botón
    fileInputRef.current.click();
  };

  const handleClose2 = () => {
    setEstado(false);
  };

  // Función para filtrar productos por nombre
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontSize: "2rem",
        position: "relative",
        width: "70vw",
        marginLeft: "13vw",
        marginRight: "13vw",
      }}
    >
      <div style={{}}>
        <Tooltip describeChild title="Agregar producto nuevo">
          <Button onClick={() => handleOpen(null)}>
            <span class="material-symbols-outlined">add_box</span>
          </Button>
        </Tooltip>
        {showContagramBtn && (
          <Box sx={style2}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/descarga.png?alt=media&token=aafd9c75-a083-4202-8191-e49fff17da21"
                alt="sistemaContable"
                style={{ borderRadius: "50px", width: "10rem" }}
              />
              <h3 style={{ margin: "1rem" }}>
                Seleccione el archivo exportado desde sistema contable
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexDirection: "column",
                }}
              >
                <Button
                  style={{
                    margin: "1rem",
                    backgroundColor: "blue",
                    color: "white",
                  }}
                  variant="contained"
                  onClick={handleClick}
                >
                  Subir archivo
                  <TextField
                    type="file"
                    inputProps={{
                      accept: ".xlsx",
                      ref: fileInputRef,
                      style: { display: "none" },
                      onChange: handleFileUpload,
                    }}
                    variant="outlined"
                  />
                </Button>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    fontFamily: "Arial, sans-serif", // Cambiar la fuente del texto
                  }}
                  open={estado}
                  onClose={handleClose2}
                >
                  <div style={{ textAlign: "center", marginTop: "10rem" }}>
                    <p style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
                      Se están cargando los archivos
                    </p>
                    <p style={{ fontSize: "1rem" }}>
                      Registros Actualizados : {updatedRecordsCount}
                      <br />
                      Total Registros a recorrer : {nonEmptyRecordsLength}
                    </p>
                    <p>
                      No cierre esta pestaña hasta que termine la
                      sincronizacion.
                    </p>
                  </div>
                  <div style={{ marginTop: "1rem", textAlign: "center" }}>
                    <CircularProgress size={50} color="info" />
                  </div>
                </Backdrop>

                <Button
                  style={{ margin: "1rem" }}
                  variant="contained"
                  onClick={() => {
                    setShowContagramBtn(false);
                  }}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </Box>
        )}
        <Tooltip describeChild title="Actualizar stock">
          <Button onClick={() => setShowContagramBtn(true)}>
            <span class="material-symbols-outlined">upload_file</span>
          </Button>
        </Tooltip>
        {/*         <Tooltip describeChild title="Importar Productos">
          <Button onClick={() => importarDatos()}>
            <span class="material-symbols-outlined">mp</span>
          </Button>
        </Tooltip> */}
        <Tooltip describeChild title="Descargar lista de productos">
          <Button onClick={() => exportToExcel()}>
            <span class="material-symbols-outlined">download</span>
          </Button>
        </Tooltip>
      </div>

      <h6>Cantidad total de productos: {productsTotal}</h6>
      <div>
        <TextField
          label=""
          onChange={handleSearch}
          value={searchTerm}
          style={{ marginLeft: "10px", padding: "5px", marginBottom: "0.5rem" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <div
                  style={{
                    width: "10rem",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{ fontSize: "150%" }}
                    class="material-symbols-outlined"
                  >
                    manage_search
                  </span>
                </div>
              </InputAdornment>
            ),
          }}
        />
      </div>
      {!open && (
        <div style={{ width: "100%" }}>
          <ItemListDetail
            products={currentProducts}
            setIsChange={setIsChange}
            isChange={isChange}
          />
          <Box
            mt={2}
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            {/* Botones de paginación */}
            <Button
              variant="contained"
              color="inherit"
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              style={{ margin: "1rem" }}
            >
              <span class="material-symbols-outlined">navigate_before</span>
            </Button>
            <Button
              variant="contained"
              onClick={() => paginate(currentPage + 1)}
              style={{ margin: "1rem" }}
            >
              <span class="material-symbols-outlined">navigate_next</span>
            </Button>
          </Box>
        </div>
      )}
      {open ? (
        <Box>
          <ProductForm
            handleClose={handleClose}
            setIsChange={setIsChange}
            productSelected={productSelected}
            setProductSelected={setProductSelected}
            setOpen={setOpen}
          />
        </Box>
      ) : null}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          fontFamily: "Arial, sans-serif",
        }}
        open={estado}
        onClose={handleClose2}
      >
        <div
          style={{
            textAlign: "center",
            marginTop: "10rem",
          }}
        >
          <p style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
            Se están cargando los archivos
          </p>
          <p style={{ fontSize: "1rem" }}>
            Registros Actualizados : {updatedRecordsCount}
            <br />
            Total Registros a recorrer : {nonEmptyRecordsLength}
          </p>
          <p>No cierre esta pestaña hasta que termine la sincronizacion.</p>
        </div>
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <CircularProgress size={50} color="info" />
        </div>
      </Backdrop>
      <input
        type="file"
        accept=".xlsx"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default ItemListContainer;
