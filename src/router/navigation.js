import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";

import ShopIcon from "@mui/icons-material/Shop";
import ClassIcon from "@mui/icons-material/Class";

import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export const menuItems = [
  {
    id: "home",
    path: "/",
    title: "Inicio",
    Icon: HomeIcon,
  },
  {
    id: "products",
    path: "/products",
    title: "Productos",
    Icon: StoreIcon,
  },
  /*   {
    id: "cart",
    path: "/cart",
    title: "Carrito",
    Icon: ShoppingCartCheckoutIcon,
  }, */
  {
    id: "userOrders",
    path: "/userOrders",
    title: "Ventas",
    Icon: ShopIcon,
  },
  {
    id: "dashboard",
    path: "/dashboard",
    title: "Clientes",
    Icon: AccountCircleIcon,
  },
  {
    id: "administracion",
    path: "/administracion",
    title: "Administracion",
    Icon: DashboardCustomizeIcon,
  },
  {
    id: "categorys",
    path: "/categorys",
    title: "Categorias",
    Icon: ClassIcon,
  },
];
