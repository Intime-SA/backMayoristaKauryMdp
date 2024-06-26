import Administracion from "../components/pages/administracion/Administracion";
import Category from "../components/pages/categorys/Category";
import Dashboard from "../components/pages/dashboard/Dashboard";
import Home from "../components/pages/home/Home";
import Cuenta from "../components/pages/home/cuenta/Cuenta";
import ItemListContainer from "../components/pages/products/ItemListContainer";
import UserOrders from "../components/pages/userOrders/UserOrders";

export const routes = [
  {
    id: "home",
    path: "/",
    Element: Home,
  },
  {
    id: "products",
    path: "/products",
    Element: ItemListContainer,
  },
  {
    id: "userOrders",
    path: "/userOrders",
    Element: UserOrders,
  },
  {
    id: "dashboard",
    path: "/dashboard",
    Element: Dashboard,
  },
  {
    id: "cuenta",
    path: "/cuenta",
    Element: Cuenta,
  },
  {
    id: "categorys",
    path: "/categorys",
    Element: Category,
  },
  {
    id: "administracion",
    path: "/administracion",
    Element: Administracion,
  },
];
