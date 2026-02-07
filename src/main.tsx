
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { AuthContextProvider } from "./app/context/AuthContext";

  createRoot(document.getElementById("root")!).render(
    <AuthContextProvider>
      <App />
    </AuthContextProvider>,
  );
  