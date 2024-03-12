import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Switch from "@mui/material/Switch";
import WifiIcon from "@mui/icons-material/Wifi";
import BluetoothIcon from "@mui/icons-material/Bluetooth";
import CategoryIcon from "@mui/icons-material/Category";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const Category = () => {
  const [categories, setCategories] = React.useState([]);

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

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      subheader={<ListSubheader>Categoría</ListSubheader>}
    >
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
  );
};

export default Category;
