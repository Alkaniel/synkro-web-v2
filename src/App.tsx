import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login.tsx";
import AuthGuard from "@/components/ui/authGuard.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import Register from "@/pages/Register.tsx";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<AuthGuard/>}>
                  <Route path="/dashboard" element={<Dashboard />}/>
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
