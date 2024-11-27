import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import MainPage from "./pages";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster
      toastOptions={{
        style: {
          color: "#fff",
          backgroundColor: "#101010",
        },
      }}
    />
    <MainPage />
  </StrictMode>,
);
