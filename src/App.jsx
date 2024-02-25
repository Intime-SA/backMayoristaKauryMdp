import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import AuthContextComponent from "./components/context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthContextComponent>
        <AppRouter />
      </AuthContextComponent>
    </BrowserRouter>
  );
}

export default App;
