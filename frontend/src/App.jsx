import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import AuthPage from "./pages/AuthPage";
import EmailConfirmPage from "./pages/EmailConfirmPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/confirm" element={<EmailConfirmPage />} />
          <Route path="/" element={<RegisterPage />} /> 
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;