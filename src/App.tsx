import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes.tsx";
import {Toaster} from "sonner";

function App() {
  return (
      <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
  )
}

export default App
