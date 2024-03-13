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
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const Category = () => {
  const [categories, setCategories] = React.useState([]);
  const [newCategoryId, setNewCategoryId] = React.useState("");
  const [newCategoryName, setNewCategoryName] = React.useState("");

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(db, "categorys");
        const querySnapshot = await getDocs(categoryCollection);
        const categoriesData = [];

        querySnapshot.forEach((doc) => {
          const category = { id: doc.id, ...doc.data() };
          categoriesData.push(category);
        });

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, [categories]);

  const handleToggle = (categoryId) => async (event) => {
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
    } catch (error) {
      console.error("Error updating category status: ", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      await setDoc(doc(db, "categorys", newCategoryId), {
        name: newCategoryName,
        status: false, // You might want to set a default status here
      });
      // Clear input fields after adding category
      setNewCategoryId("");
      setNewCategoryName("");
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  return (
    <div>
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        subheader={<ListSubheader style={{ fontSize: "150%" }}></ListSubheader>}
      >
        <div
          style={{
            width: "40vw",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <TextField
            label="ID"
            value={newCategoryId}
            onChange={(e) => setNewCategoryId(e.target.value)}
          />
          <TextField
            label="Nombre"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddCategory}>
            Agregar Categoría
          </Button>
        </div>
        {categories.map((category) => (
          <ListItem key={category.id}>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText
              id={`switch-list-label-${category.id}`}
              primary={category.name}
            />
            <Switch
              edge="end"
              onChange={handleToggle(category.id)}
              checked={category.status}
              inputProps={{
                "aria-labelledby": `switch-list-label-${category.id}`,
              }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Category;
