import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import AuthContextComponent from "./components/context/AuthContext";
import {
  DrawerContext,
  DrawerContextComponent,
} from "./components/context/DrawerContext";

function App() {
  return (
    <BrowserRouter>
      <AuthContextComponent>
        <DrawerContextComponent>
          <AppRouter />
        </DrawerContextComponent>
      </AuthContextComponent>
    </BrowserRouter>
  );
}

export default App;
