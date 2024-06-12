import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Switch from "@mui/material/Switch";
import CategoryIcon from "@mui/icons-material/Category";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  collection,
  getDocs,
  updateDoc,
  setDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, uploadFile } from "../../../firebaseConfig"; // Assuming you have a storage reference in firebaseConfig
import { Skeleton } from "@mui/material";

const Category = () => {
  const [categories, setCategories] = React.useState([]);
  const [newCategoryId, setNewCategoryId] = React.useState("");
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [actualizar, setActualizar] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Referencia a la colección "categorys" y ordena por el campo "status"
        const categoryCollection = collection(db, "categorys");
        const categoryQuery = query(categoryCollection, orderBy("status"));
        const querySnapshot = await getDocs(categoryQuery);

        const categoriesData = [];
        querySnapshot.forEach((doc) => {
          const category = { id: doc.id, ...doc.data() };
          categoriesData.push(category);
        });

        // Ordenar para que los valores true aparezcan primero
        categoriesData.sort((a, b) => b.status - a.status);

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, [actualizar]);

  const handleToggle = (categoryId) => async (event) => {
    setActualizar(!event.target.checked);

    console.log("Toggle switch for category:", categoryId);
    console.log("New switch state:", event.target.checked);

    try {
      const categoryRef = doc(db, "categorys", categoryId);
      await updateDoc(categoryRef, {
        status: event.target.checked,
      });
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId
            ? { ...category, status: event.target.checked }
            : category
        )
      );
      window.location.reload();
    } catch (error) {
      console.error("Error updating category status: ", error);
    }
  };

  const handleAddCategory = async () => {
    const isCategoryIdExists = categories.some(
      (category) => category.id === newCategoryId
    );

    if (isCategoryIdExists) {
      // Mostrar un mensaje de error o manejar la situación de alguna otra manera
      setError(
        "El ID de la categoría ya existe. Por favor, elige un ID único."
      );
      return;
    }

    const url = await uploadFile(file);
    try {
      const categoryRef = doc(db, "categorys", newCategoryId);
      const categoryData = {
        name: newCategoryName,
        status: false,
        image: url, // You might want to set a default status here
      };

      await setDoc(categoryRef, categoryData);

      // Clear input fields and image after adding category
      setNewCategoryId("");
      setNewCategoryName("");
      setError(""); // Limpiar el mensaje de error
      window.location.reload();
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        marginTop: "5rem",
      }}
    >
      {/* Sección para cargar una nueva categoría */}
      <div
        style={{
          width: "90%",
          maxWidth: "1000px",
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2
          style={{
            marginBottom: "1rem",
            fontWeight: "800",
            fontFamily: '"Kanit", sans-serif',
          }}
        >
          Nueva Categoría
        </h2>
        <TextField
          label="ID"
          value={newCategoryId}
          onChange={(e) => setNewCategoryId(e.target.value.replace(/\s/g, ""))}
          error={Boolean(error)} // Activar el estado de error en el TextField
          helperText={error} // Mostrar el mensaje de error
          InputLabelProps={{
            shrink: true,
            style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
          }}
          InputProps={{
            style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
          }}
        />
        <TextField
          fullWidth
          label="Nombre"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          style={{ marginTop: "1rem" }}
          InputLabelProps={{
            shrink: true,
            style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente de la etiqueta
          }}
          InputProps={{
            style: { fontFamily: '"Kanit", sans-serif' }, // Cambiar la fuente del valor
          }}
        />
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label htmlFor="fileInput" style={{ marginRight: "1rem" }}>
            {!isLoading && (
              <Button
                onClick={() => setIsLoading(true)}
                variant="contained"
                component="span"
                style={{
                  backgroundColor: "#3f51b5",
                  color: "white",
                  fontFamily: '"Kanit", sans-serif',
                }}
              >
                Cargar Imagen
              </Button>
            )}
          </label>
          {isLoading && (
            <Button
              onClick={handleAddCategory}
              variant="contained"
              color="success"
            >
              Crear Categoría
            </Button>
          )}
        </div>
      </div>

      {/* Sección para mostrar el listado de categorías */}
      <div
        style={{
          width: "90%",
          maxWidth: "1000px",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2
          style={{
            marginBottom: "1rem",
            fontWeight: "800",
            fontFamily: '"Kanit", sans-serif',
          }}
        >
          Listado de Categorías
        </h2>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
          subheader={<ListSubheader></ListSubheader>}
        >
          {categories.length === 0
            ? // Renderizar múltiples esqueletos de texto mientras se carga
              Array.from({ length: 5 }).map((_, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Skeleton variant="circular" width={100} height={100} />
                  </ListItemIcon>
                  <ListItemText style={{ marginLeft: "1rem" }}>
                    <Skeleton variant="text" width={150} />
                  </ListItemText>
                </ListItem>
              ))
            : // Renderizar las categorías normales una vez cargadas
              categories.map((category) => (
                <ListItem
                  style={{ display: "flex", justifyContent: "space-between" }}
                  key={category.id}
                >
                  <ListItemIcon>
                    <img
                      src={
                        category.image ||
                        "https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/Mayorista%20Mar%20del%20Plata%20(2).png?alt=media&token=87bdf689-8eb7-49b1-9317-f6a52a9a0781"
                      }
                      alt="categoryImage"
                      style={{
                        borderRadius: "20px",
                        width: "300px",
                      }}
                    />
                  </ListItemIcon>
                  <div>
                    <h5
                      style={{
                        fontFamily: '"Kanit", sans-serif',
                        margin: "1rem",
                      }}
                    >
                      {category.name}
                    </h5>
                  </div>

                  <Switch
                    edge="end"
                    onChange={handleToggle(category.id)}
                    checked={category.status}
                  />
                </ListItem>
              ))}
        </List>
      </div>
    </div>
  );
};

export default Category;
